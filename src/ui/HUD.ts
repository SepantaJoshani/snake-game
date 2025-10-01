import { Container, Text, Graphics } from "pixi.js";
import { COLORS, CANVAS_WIDTH } from "../utils/Constants";

export class HUD {
  public container: Container;
  private scoreText: Text;
  private highScoreText: Text;
  private levelText: Text;
  private speedIndicator: Graphics;
  private speedBarBg: Graphics;

  constructor() {
    this.container = new Container();

    // Score text (top-left)
    this.scoreText = new Text({
      text: "Score: 0",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        fill: COLORS.text,
        fontWeight: "bold" as const,
      },
    });
    this.scoreText.x = 20;
    this.scoreText.y = 20;

    // High score text (top-right)
    this.highScoreText = new Text({
      text: "High: 0",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        fill: COLORS.text,
        fontWeight: "bold" as const,
      },
    });
    this.highScoreText.anchor.set(1, 0);
    this.highScoreText.x = CANVAS_WIDTH - 20;
    this.highScoreText.y = 20;

    // Level/Difficulty text (bottom-left)
    this.levelText = new Text({
      text: "Level: 1",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 18,
        fill: COLORS.text,
      },
    });
    this.levelText.x = 20;
    this.levelText.y = CANVAS_WIDTH - 50;

    // Speed indicator bar background
    this.speedBarBg = new Graphics();
    this.speedBarBg.rect(20, CANVAS_WIDTH - 25, 200, 10);
    this.speedBarBg.fill({ color: 0x333333, alpha: 0.5 });

    // Speed indicator bar (foreground)
    this.speedIndicator = new Graphics();

    this.container.addChild(
      this.scoreText,
      this.highScoreText,
      this.levelText,
      this.speedBarBg,
      this.speedIndicator
    );
  }

  public update(
    score: number,
    highScore: number,
    level: number = 1,
    speedProgress: number = 0
  ): void {
    this.scoreText.text = `Score: ${score}`;
    this.highScoreText.text = `High: ${highScore}`;
    this.levelText.text = `Level: ${level}`;

    // Update speed indicator bar
    this.updateSpeedBar(speedProgress);
  }

  private updateSpeedBar(progress: number): void {
    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    // Clear and redraw speed bar
    this.speedIndicator.clear();

    // Color changes from green to yellow to red as speed increases
    let color: number;
    if (progress < 0.5) {
      color = COLORS.snakeHead; // Green
    } else if (progress < 0.8) {
      color = 0xffd93d; // Yellow
    } else {
      color = COLORS.food; // Red
    }

    this.speedIndicator.rect(20, CANVAS_WIDTH - 25, 200 * progress, 10);
    this.speedIndicator.fill({ color, alpha: 0.8 });
  }
}
