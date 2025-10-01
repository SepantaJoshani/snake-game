import { Container, Text } from 'pixi.js';
import { COLORS, CANVAS_WIDTH } from '../utils/Constants';

export class HUD {
  public container: Container;
  private scoreText: Text;
  private highScoreText: Text;

  constructor() {
    this.container = new Container();

    const textStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: 24,
      fill: COLORS.text,
      fontWeight: 'bold',
    };

    // Score text (top-left)
    this.scoreText = new Text({
      text: 'Score: 0',
      style: textStyle,
    });
    this.scoreText.x = 20;
    this.scoreText.y = 20;

    // High score text (top-right)
    this.highScoreText = new Text({
      text: 'High: 0',
      style: textStyle,
    });
    this.highScoreText.anchor.set(1, 0);
    this.highScoreText.x = CANVAS_WIDTH - 20;
    this.highScoreText.y = 20;

    this.container.addChild(this.scoreText, this.highScoreText);
  }

  public update(score: number, highScore: number): void {
    this.scoreText.text = `Score: ${score}`;
    this.highScoreText.text = `High: ${highScore}`;
  }
}
