import { QUESTIONS } from '../data/questions.js';
import { shuffle } from '../utils/helpers.js';

export class QuizSession {
  constructor(maxDifficulty = 1, category = null) {
    this.maxDifficulty = maxDifficulty;
    this.pool = shuffle(
      QUESTIONS.filter(q =>
        q.difficulty <= maxDifficulty &&
        (category === null || q.category === category)
      )
    );
    this.usedIds = new Set();
  }

  getQuestion() {
    let question = this.pool.find(q => !this.usedIds.has(q.id));

    if (!question) {
      this.usedIds.clear();
      this.pool = shuffle(this.pool);
      question = this.pool[0];
    }

    this.usedIds.add(question.id);
    return question;
  }

  checkAnswer(question, answerIndex) {
    return answerIndex === question.correctIndex;
  }
}
