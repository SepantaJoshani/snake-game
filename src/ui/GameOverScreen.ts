import { Container, Text, Graphics } from 'pixi.js';
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants';

export class GameOverScreen {
  public container: Container;
  private background: Graphics;
  private gameOverText: Text;
  private scoreText: Text;
  private highScoreText: Text;
  private instructionText: Text;

  constructor() {
    this.container = new Container();
    this.container.visible = false;

    // Semi-transparent overlay
    this.background = new Graphics();
    this.background.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.background.fill({ color: 0x000000, alpha: 0.8 });

    // Game Over text
    this.gameOverText = new Text({
      text: 'GAME OVER',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 64,
        fill: COLORS.food,
        fontWeight: 'bold',
      },
    });
    this.gameOverText.anchor.set(0.5);
    this.gameOverText.x = CANVAS_WIDTH / 2;
    this.gameOverText.y = CANVAS_HEIGHT / 2 - 80;

    // Score
    this.scoreText = new Text({
      text: 'Score: 0',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 32,
        fill: COLORS.text,
      },
    });
    this.scoreText.anchor.set(0.5);
    this.scoreText.x = CANVAS_WIDTH / 2;
    this.scoreText.y = CANVAS_HEIGHT / 2;

    // High Score
    this.highScoreText = new Text({
      text: 'High Score: 0',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        fill: COLORS.snakeHead,
      },
    });
    this.highScoreText.anchor.set(0.5);
    this.highScoreText.x = CANVAS_WIDTH / 2;
    this.highScoreText.y = CANVAS_HEIGHT / 2 + 50;

    // Instruction
    this.instructionText = new Text({
      text: 'Press SPACE to Restart',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 20,
        fill: COLORS.textDark,
      },
    });
    this.instructionText.anchor.set(0.5);
    this.instructionText.x = CANVAS_WIDTH / 2;
    this.instructionText.y = CANVAS_HEIGHT - 60;

    this.container.addChild(
      this.background,
      this.gameOverText,
      this.scoreText,
      this.highScoreText,
      this.instructionText
    );
  }

  public show(score: number, highScore: number): void {
    this.scoreText.text = `Score: ${score}`;
    this.highScoreText.text = `High Score: ${highScore}`;
    this.container.visible = true;
  }

  public hide(): void {
    this.container.visible = false;
  }
}
