// QuestionBank facade — loads JSON question banks and exposes unified API
// Math questions are procedurally generated; Science/ELA are loaded from JSON files.

import './questions/math-generator.js'; // Sets window.MathGenerator

let scienceQuestions = { 1: [], 2: [], 3: [] };
let elaQuestions = { 1: [], 2: [], 3: [] };
let loaded = false;

export const QuestionBank = {
  async init() {
    if (loaded) return;
    try {
      const [s1, s2, s3, e1, e2, e3] = await Promise.all([
        fetch('js/data/questions/science-d1.json').then(r => r.json()),
        fetch('js/data/questions/science-d2.json').then(r => r.json()),
        fetch('js/data/questions/science-d3.json').then(r => r.json()),
        fetch('js/data/questions/ela-d1.json').then(r => r.json()),
        fetch('js/data/questions/ela-d2.json').then(r => r.json()),
        fetch('js/data/questions/ela-d3.json').then(r => r.json()),
      ]);
      scienceQuestions = { 1: s1, 2: s2, 3: s3 };
      elaQuestions = { 1: e1, 2: e2, 3: e3 };
      loaded = true;
    } catch (err) {
      console.error('Failed to load question banks:', err);
      // Fallback: empty pools — math generator still works
      loaded = true;
    }
  },

  generateMath(difficulty) {
    return window.MathGenerator.generateMathQuestion(difficulty);
  },

  getStaticPool(category, maxDifficulty) {
    const bank = category === 'science' ? scienceQuestions : elaQuestions;
    const pool = [];
    for (let d = 1; d <= maxDifficulty; d++) {
      const questions = bank[d] || [];
      pool.push(...questions.map(q => ({ ...q, category, difficulty: d })));
    }
    return pool;
  }
};

export const TOPIC_CATEGORIES = [
  { id: 'math', name: 'Math', icon: '\u{1F522}', color: '#ff6b35' },
  { id: 'science', name: 'Science', icon: '\u{1F52C}', color: '#00b4d8' },
  { id: 'ela', name: 'ELA', icon: '\u{1F4DA}', color: '#b8c0ff' }
];
