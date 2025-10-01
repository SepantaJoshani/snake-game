import { POINTS_PER_FOOD } from '../utils/Constants';

const HIGH_SCORE_KEY = 'snake-game-high-score';

export class ScoreSystem {
  private currentScore: number;
  private highScore: number;

  constructor() {
    this.currentScore = 0;
    this.highScore = this.loadHighScore();
  }

  public addPoints(value: number = POINTS_PER_FOOD): void {
    this.currentScore += value;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.saveHighScore();
    }
  }

  public reset(): void {
    this.currentScore = 0;
  }

  public getScore(): number {
    return this.currentScore;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  private loadHighScore(): number {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  private saveHighScore(): void {
    localStorage.setItem(HIGH_SCORE_KEY, this.highScore.toString());
  }
}
