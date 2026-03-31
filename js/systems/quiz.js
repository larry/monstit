import { QuestionBank } from '../data/questions.js';
import { shuffle, weightedRandom } from '../utils/helpers.js';

const SEEN_STORAGE_KEY = 'monstit_seen_questions';
const RESET_THRESHOLD = 0.8;

export class QuizSession {
  constructor(maxDifficulty = 1, category = null) {
    this.maxDifficulty = maxDifficulty;
    this.category = category;
    this.sessionUsed = new Set();
    this.seenHistory = loadSeenHistory();
  }

  getQuestion() {
    if (this.category === 'math') {
      return this._getMathQuestion();
    }
    return this._getStaticQuestion();
  }

  _getMathQuestion() {
    let question;
    let attempts = 0;
    do {
      question = QuestionBank.generateMath(this.maxDifficulty);
      attempts++;
    } while (this.sessionUsed.has(question.id) && attempts < 50);
    this.sessionUsed.add(question.id);
    return question;
  }

  _getStaticQuestion() {
    const pool = QuestionBank.getStaticPool(this.category, this.maxDifficulty);
    if (pool.length === 0) {
      // Fallback if loading failed
      return QuestionBank.generateMath(this.maxDifficulty);
    }

    const key = `${this.category}_${this.maxDifficulty}`;
    const seenList = this.seenHistory[key] || [];
    const seenSet = new Set(seenList);

    // Reset if we've seen 80%+ of the pool
    if (seenSet.size >= pool.length * RESET_THRESHOLD) {
      this.seenHistory[key] = [];
      seenSet.clear();
      saveSeenHistory(this.seenHistory);
    }

    // Filter out questions used THIS session
    const candidates = pool.filter(q => !this.sessionUsed.has(q.id));
    if (candidates.length === 0) {
      this.sessionUsed.clear();
      return this._getStaticQuestion();
    }

    // Weighted selection: unseen = 10, seen = 1
    const question = weightedRandom(candidates, q => seenSet.has(q.id) ? 1 : 10);

    this.sessionUsed.add(question.id);

    // Track in cross-session history
    if (!this.seenHistory[key]) this.seenHistory[key] = [];
    this.seenHistory[key].push(question.id);
    saveSeenHistory(this.seenHistory);

    return question;
  }

  checkAnswer(question, answerIndex) {
    return answerIndex === question.correctIndex;
  }
}

function loadSeenHistory() {
  try {
    const data = localStorage.getItem(SEEN_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveSeenHistory(history) {
  try {
    // Cap each bucket at 500 entries to avoid localStorage bloat
    for (const key of Object.keys(history)) {
      if (history[key].length > 500) {
        history[key] = history[key].slice(-500);
      }
    }
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(history));
  } catch { /* localStorage full — ignore */ }
}
