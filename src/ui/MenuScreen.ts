import { Container, Text, Graphics } from "pixi.js";
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from "../utils/Constants";

export class MenuScreen {
  public container: Container;
  private background: Graphics;
  private titleText: Text;
  private instructionText: Text;
  private highScoreText: Text;

  constructor() {
    this.container = new Container();
    this.container.visible = true;

    // Semi-transparent background
    this.background = new Graphics();
    this.background.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.background.fill({ color: COLORS.background, alpha: 0.9 });

    // Title
    this.titleText = new Text({
      text: "🐍 SNAKE",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 72,
        fill: COLORS.snakeHead,
        fontWeight: "bold",
      },
    });
    this.titleText.anchor.set(0.5);
    this.titleText.x = CANVAS_WIDTH / 2;
    this.titleText.y = CANVAS_HEIGHT / 2 - 80;

    // Instructions
    this.instructionText = new Text({
      text: "Press SPACE to Start\n\nUse Arrow Keys or WASD to move\nP to Pause • F for Performance Stats • M to Mute",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        fill: COLORS.text,
        align: "center",
      },
    });
    this.instructionText.anchor.set(0.5);
    this.instructionText.x = CANVAS_WIDTH / 2;
    this.instructionText.y = CANVAS_HEIGHT / 2 + 40;

    // High score
    this.highScoreText = new Text({
      text: "High Score: 0",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 20,
        fill: COLORS.textDark,
      },
    });
    this.highScoreText.anchor.set(0.5);
    this.highScoreText.x = CANVAS_WIDTH / 2;
    this.highScoreText.y = CANVAS_HEIGHT - 40;

    this.container.addChild(
      this.background,
      this.titleText,
      this.instructionText,
      this.highScoreText
    );
  }

  public show(): void {
    this.container.visible = true;
  }

  public hide(): void {
    this.container.visible = false;
  }

  public updateHighScore(score: number): void {
    this.highScoreText.text = `High Score: ${score}`;
  }
}
