const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files
app.use(express.static(path.join(__dirname)));

// --- Room Management ---
const rooms = new Map();
let nextRoomId = 1;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function broadcastToRoom(roomId, msg, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  const data = JSON.stringify(msg);
  room.players.forEach(p => {
    if (p.ws !== excludeWs && p.ws.readyState === 1) {
      p.ws.send(data);
    }
  });
}

function sendTo(ws, msg) {
  if (ws.readyState === 1) ws.send(JSON.stringify(msg));
}

function cleanupRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.players.forEach(p => {
    if (p.ws.readyState === 1) {
      sendTo(p.ws, { type: 'room_closed', reason: 'Opponent disconnected' });
    }
    p.ws.roomId = null;
  });
  rooms.delete(roomId);
}

// --- Question Bank (server-side so both players get the same question) ---
const QUESTIONS = [
  { q: 'What is 7 x 8?', a: ['54', '56', '58', '64'], c: 1 },
  { q: 'What is 12 + 15?', a: ['25', '26', '27', '28'], c: 2 },
  { q: 'What is 100 - 37?', a: ['53', '63', '67', '73'], c: 1 },
  { q: 'What is 9 x 6?', a: ['48', '52', '54', '56'], c: 2 },
  { q: 'What is 45 + 28?', a: ['63', '73', '83', '68'], c: 1 },
  { q: 'What is 81 / 9?', a: ['7', '8', '9', '10'], c: 2 },
  { q: 'What is 13 x 12?', a: ['144', '156', '168', '132'], c: 1 },
  { q: 'What is the square root of 144?', a: ['10', '11', '12', '14'], c: 2 },
  { q: 'What planet is closest to the Sun?', a: ['Venus', 'Mercury', 'Mars', 'Earth'], c: 1 },
  { q: 'What gas do plants absorb?', a: ['Oxygen', 'Nitrogen', 'CO2', 'Hydrogen'], c: 2 },
  { q: 'How many legs does a spider have?', a: ['6', '8', '10', '12'], c: 1 },
  { q: 'What is the boiling point of water (C)?', a: ['90', '95', '100', '110'], c: 2 },
  { q: 'What is the largest planet?', a: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], c: 1 },
  { q: 'What is the chemical symbol for gold?', a: ['Go', 'Gd', 'Au', 'Ag'], c: 2 },
  { q: 'What is the largest continent?', a: ['Africa', 'Asia', 'Europe', 'N. America'], c: 1 },
  { q: 'What ocean is the largest?', a: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], c: 2 },
  { q: 'How many colors are in a rainbow?', a: ['5', '6', '7', '8'], c: 2 },
  { q: 'What shape has 6 sides?', a: ['Pentagon', 'Hexagon', 'Heptagon', 'Octagon'], c: 1 },
  { q: 'Who painted the Mona Lisa?', a: ['Michelangelo', 'Da Vinci', 'Raphael', 'Donatello'], c: 1 },
  { q: 'What is the hardest natural substance?', a: ['Gold', 'Iron', 'Diamond', 'Titanium'], c: 2 },
  { q: 'What is 15% of 200?', a: ['20', '25', '30', '35'], c: 2 },
  { q: 'What is 3^4?', a: ['64', '81', '27', '108'], c: 1 },
  { q: 'What mountain is the tallest?', a: ['K2', 'Kangchenjunga', 'Mt. Everest', 'Lhotse'], c: 2 },
  { q: 'What is the capital of Australia?', a: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], c: 2 },
  { q: 'How many bones in the adult body?', a: ['186', '196', '206', '216'], c: 2 },
];

function pickQuestion(usedIds) {
  const available = QUESTIONS.filter((_, i) => !usedIds.has(i));
  if (available.length === 0) {
    usedIds.clear();
    return pickQuestion(usedIds);
  }
  const idx = QUESTIONS.indexOf(available[Math.floor(Math.random() * available.length)]);
  usedIds.add(idx);
  return { index: idx, ...QUESTIONS[idx] };
}

// --- Battle Logic ---
function startBattle(roomId) {
  const room = rooms.get(roomId);
  if (!room || room.players.length !== 2) return;

  room.state = 'battle';
  room.usedQuestions = new Set();
  room.turn = 0;

  // Send both players' monster info to each other
  room.players.forEach((p, i) => {
    const opponent = room.players[1 - i];
    sendTo(p.ws, {
      type: 'battle_start',
      yourMonster: p.monster,
      opponentMonster: opponent.monster,
      opponentName: opponent.name
    });
  });

  // Start first turn after a short delay
  setTimeout(() => nextTurn(roomId), 1500);
}

function nextTurn(roomId) {
  const room = rooms.get(roomId);
  if (!room || room.state !== 'battle') return;

  room.turn++;
  room.answers = [null, null];
  room.answeredCount = 0;

  const question = pickQuestion(room.usedQuestions);
  room.currentQuestion = question;

  room.players.forEach(p => {
    sendTo(p.ws, {
      type: 'question',
      turn: room.turn,
      question: question.q,
      answers: question.a
    });
  });

  // 15 second timeout — anyone who hasn't answered gets it wrong
  room.turnTimeout = setTimeout(() => {
    room.players.forEach((p, i) => {
      if (room.answers[i] === null) {
        room.answers[i] = -1; // timed out = wrong
        room.answeredCount++;
      }
    });
    if (room.answeredCount >= 2) resolveTurn(roomId);
  }, 15000);
}

function resolveTurn(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  clearTimeout(room.turnTimeout);

  const correctIdx = room.currentQuestion.c;
  const results = room.players.map((p, i) => {
    const correct = room.answers[i] === correctIdx;
    return { correct, answer: room.answers[i] };
  });

  // Calculate damage: if you answer correctly, you deal damage to opponent
  const damages = [0, 0];
  room.players.forEach((p, i) => {
    const opponent = room.players[1 - i];
    if (results[i].correct) {
      const atk = p.monster.attack;
      const def = opponent.monster.defense;
      const base = atk * 2 - def;
      const variance = 0.85 + Math.random() * 0.3;
      damages[1 - i] = Math.max(1, Math.floor(base * variance)); // damage dealt TO opponent
    }
  });

  // Apply damage
  room.players.forEach((p, i) => {
    p.monster.currentHp = Math.max(0, p.monster.currentHp - damages[i]);
  });

  // Send results
  room.players.forEach((p, i) => {
    const opponent = room.players[1 - i];
    sendTo(p.ws, {
      type: 'turn_result',
      correctIndex: correctIdx,
      youCorrect: results[i].correct,
      opponentCorrect: results[1 - i].correct,
      damageToYou: damages[i],
      damageToOpponent: damages[1 - i],
      yourHp: p.monster.currentHp,
      opponentHp: opponent.monster.currentHp,
      yourMaxHp: p.monster.hp,
      opponentMaxHp: opponent.monster.hp
    });
  });

  // Check for game over
  const dead = room.players.map(p => p.monster.currentHp <= 0);
  if (dead[0] || dead[1]) {
    setTimeout(() => {
      let winnerIdx = -1;
      if (dead[0] && dead[1]) winnerIdx = -1; // draw
      else if (dead[0]) winnerIdx = 1;
      else winnerIdx = 0;

      room.players.forEach((p, i) => {
        sendTo(p.ws, {
          type: 'battle_over',
          result: winnerIdx === -1 ? 'draw' : (i === winnerIdx ? 'win' : 'lose'),
          gems: winnerIdx === -1 ? 10 : (i === winnerIdx ? 30 : 5)
        });
      });

      room.state = 'lobby';
    }, 2000);
  } else {
    setTimeout(() => nextTurn(roomId), 2500);
  }
}

// --- WebSocket Handling ---
wss.on('connection', (ws) => {
  ws.roomId = null;
  ws.playerIndex = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'create_room': {
        const code = generateRoomCode();
        const room = {
          code,
          players: [{
            ws,
            name: msg.name || 'Player 1',
            monster: null
          }],
          state: 'lobby',
          usedQuestions: new Set()
        };
        rooms.set(code, room);
        ws.roomId = code;
        ws.playerIndex = 0;
        sendTo(ws, { type: 'room_created', code });
        break;
      }

      case 'join_room': {
        const code = (msg.code || '').toUpperCase();
        const room = rooms.get(code);
        if (!room) {
          sendTo(ws, { type: 'error', message: 'Room not found' });
          break;
        }
        if (room.players.length >= 2) {
          sendTo(ws, { type: 'error', message: 'Room is full' });
          break;
        }
        room.players.push({
          ws,
          name: msg.name || 'Player 2',
          monster: null
        });
        ws.roomId = code;
        ws.playerIndex = 1;
        sendTo(ws, { type: 'room_joined', code });
        broadcastToRoom(code, {
          type: 'player_joined',
          playerCount: room.players.length,
          names: room.players.map(p => p.name)
        });
        break;
      }

      case 'quick_match': {
        // Find an open room or create one
        let found = null;
        for (const [code, room] of rooms) {
          if (room.state === 'lobby' && room.players.length === 1) {
            found = code;
            break;
          }
        }
        if (found) {
          const room = rooms.get(found);
          room.players.push({
            ws,
            name: msg.name || 'Player 2',
            monster: null
          });
          ws.roomId = found;
          ws.playerIndex = 1;
          sendTo(ws, { type: 'room_joined', code: found });
          broadcastToRoom(found, {
            type: 'player_joined',
            playerCount: room.players.length,
            names: room.players.map(p => p.name)
          });
        } else {
          // Create new room for quick match
          const code = generateRoomCode();
          const room = {
            code,
            players: [{
              ws,
              name: msg.name || 'Player 1',
              monster: null
            }],
            state: 'lobby',
            usedQuestions: new Set()
          };
          rooms.set(code, room);
          ws.roomId = code;
          ws.playerIndex = 0;
          sendTo(ws, { type: 'room_created', code, waiting: true });
        }
        break;
      }

      case 'select_monster': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const player = room.players[ws.playerIndex];
        player.monster = msg.monster;

        broadcastToRoom(ws.roomId, {
          type: 'monster_selected',
          playerIndex: ws.playerIndex,
          name: player.name,
          ready: room.players.every(p => p.monster)
        });

        // Both ready? Start!
        if (room.players.length === 2 && room.players.every(p => p.monster)) {
          setTimeout(() => startBattle(ws.roomId), 1000);
        }
        break;
      }

      case 'answer': {
        const room = rooms.get(ws.roomId);
        if (!room || room.state !== 'battle') break;
        if (room.answers[ws.playerIndex] !== null) break; // already answered

        room.answers[ws.playerIndex] = msg.answerIndex;
        room.answeredCount++;

        // Let opponent know this player answered (but not what)
        const opponent = room.players[1 - ws.playerIndex];
        sendTo(opponent.ws, { type: 'opponent_answered' });

        if (room.answeredCount >= 2) {
          resolveTurn(ws.roomId);
        }
        break;
      }

      case 'leave_room': {
        if (ws.roomId) {
          cleanupRoom(ws.roomId);
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    if (ws.roomId) {
      cleanupRoom(ws.roomId);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Monstit server running on http://localhost:${PORT}`);
});
