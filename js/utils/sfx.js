let ctx = null;
let sfxGain = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.5;
    sfxGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function getDest() {
  getCtx();
  return sfxGain;
}

export function playHit() {
  const c = getCtx();
  const dest = getDest();
  const now = c.currentTime;

  // Punchy impact — short burst of noise-like sound + low thump
  // Thump
  const thump = c.createOscillator();
  const thumpGain = c.createGain();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(150, now);
  thump.frequency.exponentialRampToValueAtTime(40, now + 0.15);
  thumpGain.gain.setValueAtTime(0.6, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  thump.connect(thumpGain);
  thumpGain.connect(dest);
  thump.start(now);
  thump.stop(now + 0.15);

  // Crack/snap
  const crack = c.createOscillator();
  const crackGain = c.createGain();
  crack.type = 'square';
  crack.frequency.setValueAtTime(800, now);
  crack.frequency.exponentialRampToValueAtTime(200, now + 0.08);
  crackGain.gain.setValueAtTime(0.3, now);
  crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
  crack.connect(crackGain);
  crackGain.connect(dest);
  crack.start(now);
  crack.stop(now + 0.08);

  // High click
  const click = c.createOscillator();
  const clickGain = c.createGain();
  click.type = 'sawtooth';
  click.frequency.setValueAtTime(1200, now);
  click.frequency.exponentialRampToValueAtTime(300, now + 0.05);
  clickGain.gain.setValueAtTime(0.15, now);
  clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
  click.connect(clickGain);
  clickGain.connect(dest);
  click.start(now);
  click.stop(now + 0.05);
}

export function playMiss() {
  const c = getCtx();
  const dest = getDest();
  const now = c.currentTime;

  // Whoosh sound
  const whoosh = c.createOscillator();
  const whooshGain = c.createGain();
  whoosh.type = 'sine';
  whoosh.frequency.setValueAtTime(400, now);
  whoosh.frequency.exponentialRampToValueAtTime(100, now + 0.25);
  whooshGain.gain.setValueAtTime(0.15, now);
  whooshGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  whoosh.connect(whooshGain);
  whooshGain.connect(dest);
  whoosh.start(now);
  whoosh.stop(now + 0.25);
}

export function playHeal() {
  const c = getCtx();
  const dest = getDest();
  const now = c.currentTime;

  // Rising sparkle
  [0, 0.1, 0.2].forEach((delay, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + i * 200, now + delay);
    g.gain.setValueAtTime(0.2, now + delay);
    g.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);
    osc.connect(g);
    g.connect(dest);
    osc.start(now + delay);
    osc.stop(now + delay + 0.15);
  });
}

export function playVictory() {
  const c = getCtx();
  const dest = getDest();
  const now = c.currentTime;

  // Triumphant fanfare — rising notes
  const notes = [60, 64, 67, 72];
  notes.forEach((note, i) => {
    const freq = 440 * Math.pow(2, (note - 69) / 12);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = now + i * 0.15;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.03);
    g.gain.setValueAtTime(0.25, t + 0.2);
    g.gain.linearRampToValueAtTime(0, t + 0.4);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}

export function playDefeat() {
  const c = getCtx();
  const dest = getDest();
  const now = c.currentTime;

  // Sad descending notes
  const notes = [67, 64, 60, 55];
  notes.forEach((note, i) => {
    const freq = 440 * Math.pow(2, (note - 69) / 12);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = now + i * 0.25;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.2, t + 0.03);
    g.gain.setValueAtTime(0.2, t + 0.3);
    g.gain.linearRampToValueAtTime(0, t + 0.5);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.5);
  });
}
