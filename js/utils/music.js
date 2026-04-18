let ctx = null;
let currentTrack = null;
let masterGain = null;
let trackGain = null;
let isPlaying = false;
let currentTrackName = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

function getTrackDest() {
  return trackGain || masterGain;
}

function noteFreq(note) {
  // note: MIDI number, 60 = middle C
  return 440 * Math.pow(2, (note - 69) / 12);
}

function createOsc(type, freq, gain, time, duration, destination) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 0.02);
  g.gain.linearRampToValueAtTime(gain * 0.6, time + duration * 0.5);
  g.gain.linearRampToValueAtTime(0, time + duration - 0.02);
  osc.connect(g);
  g.connect(destination);
  osc.start(time);
  osc.stop(time + duration);
  return osc;
}

function createPad(freq, gain, time, duration, destination) {
  const c = getCtx();
  const osc1 = c.createOscillator();
  const osc2 = c.createOscillator();
  const g = c.createGain();
  osc1.type = 'sine';
  osc2.type = 'triangle';
  osc1.frequency.value = freq;
  osc2.frequency.value = freq * 1.002; // slight detune for warmth
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 0.3);
  g.gain.setValueAtTime(gain, time + duration - 0.4);
  g.gain.linearRampToValueAtTime(0, time + duration);
  osc1.connect(g);
  osc2.connect(g);
  g.connect(destination);
  osc1.start(time);
  osc1.stop(time + duration);
  osc2.start(time);
  osc2.stop(time + duration);
}

// ============= TRACK DEFINITIONS =============

function scheduleMenu(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 100;
  const beat = 60 / bpm;
  const totalBeats = 16;
  const loopDur = totalBeats * beat;

  // Cheerful melody in C major
  const melody = [60, 64, 67, 72, 71, 67, 64, 67, 65, 69, 72, 76, 74, 72, 69, 67];
  melody.forEach((note, i) => {
    createOsc('triangle', noteFreq(note), 0.15, startTime + i * beat, beat * 0.8, dest);
  });

  // Bass line
  const bass = [48, 48, 45, 45, 43, 43, 48, 48, 48, 48, 45, 45, 43, 43, 48, 48];
  bass.forEach((note, i) => {
    createOsc('sine', noteFreq(note), 0.12, startTime + i * beat, beat * 0.9, dest);
  });

  // Chords (pads)
  const chords = [
    { notes: [60, 64, 67], start: 0, dur: 4 },
    { notes: [57, 60, 64], start: 4, dur: 4 },
    { notes: [55, 59, 62], start: 8, dur: 4 },
    { notes: [55, 60, 64], start: 12, dur: 4 },
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.04, startTime + ch.start * beat, ch.dur * beat, dest);
    });
  });

  return loopDur;
}

function scheduleEarth(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 80;
  const beat = 60 / bpm;
  const totalBeats = 16;
  const loopDur = totalBeats * beat;

  // Deep, grounded melody in D minor pentatonic
  const melody = [62, 65, 67, 69, 67, 65, 62, 60, 62, 65, 67, 69, 72, 69, 67, 65];
  melody.forEach((note, i) => {
    createOsc('triangle', noteFreq(note), 0.12, startTime + i * beat, beat * 0.7, dest);
  });

  // Heavy bass
  const bass = [38, -1, 38, -1, 36, -1, 36, -1, 38, -1, 38, -1, 36, -1, 36, 38];
  bass.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.15, startTime + i * beat, beat * 0.8, dest);
  });

  // Earthy pads
  const chords = [
    { notes: [50, 53, 57], start: 0, dur: 4 },
    { notes: [48, 52, 55], start: 4, dur: 4 },
    { notes: [50, 53, 57], start: 8, dur: 4 },
    { notes: [48, 52, 55], start: 12, dur: 4 },
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.035, startTime + ch.start * beat, ch.dur * beat, dest);
    });
  });

  return loopDur;
}

function scheduleWater(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 90;
  const beat = 60 / bpm;
  const totalBeats = 16;
  const loopDur = totalBeats * beat;

  // Flowing melody in F major / lydian feel
  const melody = [65, 69, 72, 77, 76, 72, 69, 65, 67, 72, 76, 77, 76, 72, 69, 65];
  melody.forEach((note, i) => {
    createOsc('sine', noteFreq(note), 0.12, startTime + i * beat, beat * 0.85, dest);
  });

  // Arpeggiated water drops
  const arps = [72, -1, 77, -1, 76, -1, 72, -1, 74, -1, 77, -1, 76, -1, 72, -1];
  arps.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note + 12), 0.05, startTime + i * beat + beat * 0.5, beat * 0.3, dest);
  });

  // Deep ocean bass
  const bass = [41, -1, 41, -1, 43, -1, 43, -1, 41, -1, 41, -1, 43, -1, 41, -1];
  bass.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.12, startTime + i * beat, beat * 0.9, dest);
  });

  // Watery pads
  const chords = [
    { notes: [53, 57, 60], start: 0, dur: 4 },
    { notes: [55, 59, 62], start: 4, dur: 4 },
    { notes: [53, 57, 60], start: 8, dur: 4 },
    { notes: [55, 59, 62], start: 12, dur: 4 },
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.03, startTime + ch.start * beat, ch.dur * beat, dest);
    });
  });

  return loopDur;
}

function scheduleCloud(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 75;
  const beat = 60 / bpm;
  const totalBeats = 16;
  const loopDur = totalBeats * beat;

  // Ethereal melody, high and airy - Eb major
  const melody = [75, 79, 82, 84, 82, 79, 75, 72, 70, 72, 75, 79, 82, 84, 82, 79];
  melody.forEach((note, i) => {
    createOsc('sine', noteFreq(note), 0.09, startTime + i * beat, beat * 0.9, dest);
  });

  // Twinkling high notes
  const twinkle = [87, -1, -1, 91, -1, -1, 87, -1, 84, -1, -1, 91, -1, -1, 87, -1];
  twinkle.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.04, startTime + i * beat, beat * 0.4, dest);
  });

  // Floating pads - lots of reverb-like layers
  const chords = [
    { notes: [58, 63, 67, 70], start: 0, dur: 8 },
    { notes: [56, 60, 63, 68], start: 8, dur: 8 },
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.03, startTime + ch.start * beat, ch.dur * beat, dest);
      // Extra octave up for shimmer
      createPad(noteFreq(n + 12), 0.015, startTime + ch.start * beat + 0.2, ch.dur * beat - 0.2, dest);
    });
  });

  return loopDur;
}

function scheduleSand(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 85;
  const beat = 60 / bpm;
  const totalBeats = 16;
  const loopDur = totalBeats * beat;

  // Middle-eastern feel - D harmonic minor scale
  const melody = [62, 65, 66, 69, 70, 69, 66, 65, 62, 61, 62, 65, 66, 69, 70, 69];
  melody.forEach((note, i) => {
    createOsc('sawtooth', noteFreq(note), 0.06, startTime + i * beat, beat * 0.6, dest);
  });

  // Rhythmic percussion-like hits
  const perc = [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1];
  perc.forEach((hit, i) => {
    if (!hit) return;
    // Use filtered noise-like sound
    createOsc('square', noteFreq(90 + Math.random() * 5), 0.03, startTime + i * beat, beat * 0.1, dest);
  });

  // Droning bass
  const bass = [38, -1, 38, 38, -1, 38, -1, 38, 37, -1, 37, 38, -1, 38, -1, 38];
  bass.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.12, startTime + i * beat, beat * 0.7, dest);
  });

  // Desert pads
  const chords = [
    { notes: [50, 54, 57], start: 0, dur: 4 },
    { notes: [49, 53, 57], start: 4, dur: 4 },
    { notes: [50, 54, 57], start: 8, dur: 4 },
    { notes: [49, 53, 57], start: 12, dur: 4 },
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.03, startTime + ch.start * beat, ch.dur * beat, dest);
    });
  });

  return loopDur;
}

function scheduleFire(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 120;
  const beat = 60 / bpm;
  const totalBeats = 16;
  const loopDur = totalBeats * beat;

  // Intense, driving melody - E minor
  const melody = [64, 67, 71, 72, 71, 67, 64, 60, 64, 67, 71, 76, 75, 72, 71, 67];
  melody.forEach((note, i) => {
    createOsc('sawtooth', noteFreq(note), 0.07, startTime + i * beat, beat * 0.5, dest);
  });

  // Aggressive bass
  const bass = [40, 40, -1, 40, 40, -1, 40, 40, 39, 39, -1, 39, 40, -1, 40, 40];
  bass.forEach((note, i) => {
    if (note < 0) return;
    createOsc('square', noteFreq(note), 0.08, startTime + i * beat, beat * 0.4, dest);
    createOsc('sine', noteFreq(note - 12), 0.1, startTime + i * beat, beat * 0.5, dest);
  });

  // Fast rhythmic hits
  for (let i = 0; i < totalBeats; i++) {
    createOsc('square', noteFreq(95), 0.04, startTime + i * beat, beat * 0.08, dest);
    if (i % 2 === 0) {
      createOsc('square', noteFreq(80), 0.05, startTime + i * beat, beat * 0.1, dest);
    }
  }

  // Power chords
  const chords = [
    { notes: [52, 59, 64], start: 0, dur: 4 },
    { notes: [51, 55, 59], start: 4, dur: 4 },
    { notes: [52, 59, 64], start: 8, dur: 4 },
    { notes: [51, 55, 59], start: 12, dur: 2 },
    { notes: [52, 56, 59], start: 14, dur: 2 },
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.035, startTime + ch.start * beat, ch.dur * beat, dest);
    });
  });

  return loopDur;
}

function scheduleBattle(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 140;
  const beat = 60 / bpm;
  const totalBeats = 16;
  const loopDur = totalBeats * beat;

  // Tense battle melody - A minor
  const melody = [69, 72, 76, 77, 76, 72, 69, 68, 69, 72, 76, 81, 80, 77, 76, 72];
  melody.forEach((note, i) => {
    createOsc('square', noteFreq(note), 0.06, startTime + i * beat, beat * 0.45, dest);
  });

  // Pumping bass
  const bass = [45, -1, 45, 45, -1, 45, -1, 45, 44, -1, 44, 45, -1, 45, 45, -1];
  bass.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.13, startTime + i * beat, beat * 0.4, dest);
    createOsc('square', noteFreq(note), 0.04, startTime + i * beat, beat * 0.3, dest);
  });

  // Drum-like rhythm
  for (let i = 0; i < totalBeats; i++) {
    // Kick on every beat
    createOsc('sine', 55, 0.1, startTime + i * beat, beat * 0.12, dest);
    // Snare on 2 and 4
    if (i % 4 === 2) {
      createOsc('square', noteFreq(95), 0.06, startTime + i * beat, beat * 0.08, dest);
    }
    // Hi-hat
    createOsc('square', noteFreq(100), 0.02, startTime + i * beat + beat * 0.5, beat * 0.06, dest);
  }

  return loopDur;
}

function schedulePrimeval(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 72;
  const beat = 60 / bpm;
  const totalBeats = 32;
  const loopDur = totalBeats * beat;

  // Majestic Jurassic-inspired melody — Bb major, sweeping and grand
  // Phrase 1: The wonder theme (rising, awe-inspiring)
  const melody1 = [
    58, -1, 65, 65, 67, -1, 70, -1,   // Bb . F F G . Bb .
    70, 69, 67, -1, 65, -1, -1, -1,    // Bb A G . F . . .
  ];
  // Phrase 2: The grandeur repeat (higher, triumphant)
  const melody2 = [
    70, -1, 72, 74, 77, -1, 74, -1,   // Bb . C D F . D .
    74, 72, 70, -1, 67, -1, 65, -1,    // D C Bb . G . F .
  ];
  const melody = [...melody1, ...melody2];
  melody.forEach((note, i) => {
    if (note < 0) return;
    // Use a warm horn-like triangle + sine layering
    createOsc('triangle', noteFreq(note), 0.11, startTime + i * beat, beat * 0.85, dest);
    createOsc('sine', noteFreq(note), 0.06, startTime + i * beat + 0.01, beat * 0.7, dest);
  });

  // Counter-melody — higher register twinkling, like strings
  const counter = [
    -1, -1, -1, -1, 77, 79, 77, -1,
    -1, -1, 74, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, 82, 81, 79, -1,
    77, -1, -1, -1, 74, -1, -1, -1,
  ];
  counter.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.05, startTime + i * beat, beat * 0.6, dest);
  });

  // Deep, rumbling bass — like distant thunder / giant footsteps
  const bass = [
    46, -1, -1, 46, -1, -1, 46, -1,
    44, -1, -1, 44, -1, -1, 43, -1,
    46, -1, -1, 46, -1, -1, 48, -1,
    46, -1, -1, 44, -1, -1, 43, -1,
  ];
  bass.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.14, startTime + i * beat, beat * 1.2, dest);
    // Sub-bass octave for rumble
    createOsc('sine', noteFreq(note - 12), 0.08, startTime + i * beat, beat * 1.0, dest);
  });

  // Grand orchestral pads — warm, sweeping chords
  const chords = [
    { notes: [58, 62, 65, 70], start: 0, dur: 4 },   // Bb major
    { notes: [58, 62, 65, 69], start: 4, dur: 4 },   // Bb with A (passing)
    { notes: [55, 60, 63, 67], start: 8, dur: 4 },   // Eb major
    { notes: [53, 58, 62, 65], start: 12, dur: 4 },  // F major (dominant)
    { notes: [58, 62, 65, 70], start: 16, dur: 4 },  // Bb major
    { notes: [60, 63, 67, 72], start: 20, dur: 4 },  // Cm (relative minor, drama)
    { notes: [55, 60, 63, 67], start: 24, dur: 4 },  // Eb major
    { notes: [53, 58, 62, 65], start: 28, dur: 4 },  // F major (resolve)
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.035, startTime + ch.start * beat, ch.dur * beat, dest);
      // Octave shimmer for grandeur
      createPad(noteFreq(n + 12), 0.012, startTime + ch.start * beat + 0.15, ch.dur * beat - 0.15, dest);
    });
  });

  // Timpani-like rhythmic hits on key moments
  const timpani = [0, -1, -1, -1, 4, -1, -1, -1, 8, -1, -1, -1, 12, -1, 14, -1,
                   16, -1, -1, -1, 20, -1, -1, -1, 24, -1, -1, -1, 28, -1, 30, -1];
  timpani.forEach((hit, i) => {
    if (hit < 0) return;
    createOsc('sine', noteFreq(34), 0.08, startTime + i * beat, beat * 0.2, dest);
  });

  return loopDur;
}

function scheduleDragon(startTime) {
  const c = getCtx();
  const dest = getTrackDest();
  const bpm = 68;
  const beat = 60 / bpm;
  const totalBeats = 32;
  const loopDur = totalBeats * beat;

  // Soaring heroic theme — D minor (mythic / dragon-flight flavor)
  // Phrase 1: ascent up the mountain
  const melody1 = [
    62, -1, 65, 67, 69, -1, 72, -1,   // D . F G A . D .
    74, 72, 69, -1, 67, -1, 65, -1,    // E D A . G . F .
  ];
  // Phrase 2: triumphant peak
  const melody2 = [
    69, -1, 72, 74, 77, -1, 74, -1,   // A . D E G . E .
    74, 72, 69, -1, 65, -1, 62, -1,    // E D A . F . D .
  ];
  const melody = [...melody1, ...melody2];
  melody.forEach((note, i) => {
    if (note < 0) return;
    // Brass-like horn: triangle + sawtooth layer for edge
    createOsc('triangle', noteFreq(note), 0.11, startTime + i * beat, beat * 0.85, dest);
    createOsc('sawtooth', noteFreq(note), 0.04, startTime + i * beat + 0.015, beat * 0.65, dest);
  });

  // Counter-melody — flute-like, evokes wind over peaks
  const counter = [
    -1, -1, -1, -1, 81, 79, 77, -1,
    -1, -1, 81, -1, 77, -1, -1, -1,
    -1, -1, -1, -1, 84, 82, 81, -1,
    79, -1, 77, -1, 74, -1, -1, -1,
  ];
  counter.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.05, startTime + i * beat, beat * 0.6, dest);
  });

  // Deep dragon-breath bass — slow and menacing
  const bass = [
    38, -1, -1, 38, -1, -1, 38, -1,
    36, -1, -1, 36, -1, -1, 37, -1,
    38, -1, -1, 38, -1, -1, 41, -1,
    38, -1, -1, 36, -1, -1, 37, -1,
  ];
  bass.forEach((note, i) => {
    if (note < 0) return;
    createOsc('sine', noteFreq(note), 0.15, startTime + i * beat, beat * 1.3, dest);
    createOsc('sine', noteFreq(note - 12), 0.09, startTime + i * beat, beat * 1.1, dest);
  });

  // Orchestral pads — heroic minor progression
  const chords = [
    { notes: [50, 53, 57, 62], start: 0, dur: 4 },   // Dm
    { notes: [48, 52, 55, 60], start: 4, dur: 4 },   // C
    { notes: [53, 57, 60, 65], start: 8, dur: 4 },   // F
    { notes: [49, 53, 57, 62], start: 12, dur: 4 },  // Dm/C#
    { notes: [50, 53, 57, 62], start: 16, dur: 4 },  // Dm
    { notes: [55, 58, 62, 67], start: 20, dur: 4 },  // Gm (tension)
    { notes: [53, 57, 60, 65], start: 24, dur: 4 },  // F
    { notes: [50, 53, 57, 62], start: 28, dur: 4 },  // Dm (resolve)
  ];
  chords.forEach(ch => {
    ch.notes.forEach(n => {
      createPad(noteFreq(n), 0.035, startTime + ch.start * beat, ch.dur * beat, dest);
      createPad(noteFreq(n + 12), 0.012, startTime + ch.start * beat + 0.15, ch.dur * beat - 0.15, dest);
    });
  });

  // Timpani + cymbal-like hits on the grand beats
  const timpani = [0, -1, -1, -1, 4, -1, -1, -1, 8, -1, -1, -1, 12, -1, 15, -1,
                   16, -1, -1, -1, 20, -1, -1, -1, 24, -1, -1, -1, 28, -1, 31, -1];
  timpani.forEach((hit, i) => {
    if (hit < 0) return;
    createOsc('sine', noteFreq(33), 0.09, startTime + i * beat, beat * 0.25, dest);
  });

  return loopDur;
}

// ============= TRACK MAP =============

const TRACKS = {
  menu: scheduleMenu,
  earth: scheduleEarth,
  water: scheduleWater,
  cloud: scheduleCloud,
  sand: scheduleSand,
  fire: scheduleFire,
  primeval: schedulePrimeval,
  dragon: scheduleDragon,
  battle: scheduleBattle,
};

// ============= PUBLIC API =============

let loopTimer = null;

export function playTrack(name) {
  if (currentTrackName === name && isPlaying) return;

  stopTrack();

  const scheduler = TRACKS[name];
  if (!scheduler) return;

  const c = getCtx();
  if (c.state === 'suspended') c.resume();

  // Create a fresh gain node for this track so we can kill it instantly on stop
  trackGain = c.createGain();
  trackGain.gain.value = 1;
  trackGain.connect(masterGain);

  currentTrackName = name;
  isPlaying = true;

  function scheduleLoop() {
    if (!isPlaying || currentTrackName !== name) return;
    const now = getCtx().currentTime + 0.1;
    const loopDur = scheduler(now);
    loopTimer = setTimeout(() => scheduleLoop(), (loopDur - 0.5) * 1000);
  }

  scheduleLoop();
}

export function stopTrack() {
  isPlaying = false;
  currentTrackName = null;
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  // Instantly silence and disconnect the old track's audio
  if (trackGain) {
    trackGain.gain.setValueAtTime(0, getCtx().currentTime);
    trackGain.disconnect();
    trackGain = null;
  }
}

export function setVolume(vol) {
  if (masterGain) {
    masterGain.gain.value = vol;
  }
}

export function getMusicEnabled() {
  return localStorage.getItem('monstit_music') !== 'off';
}

export function setMusicEnabled(enabled) {
  localStorage.setItem('monstit_music', enabled ? 'on' : 'off');
  if (!enabled) stopTrack();
}
