import { Container, Text, Graphics } from 'pixi.js';
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants';

export class PauseScreen {
  public container: Container;
  private background: Graphics;
  private pauseText: Text;
  private instructionText: Text;

  constructor() {
    this.container = new Container();
    this.container.visible = false;

    // Semi-transparent overlay
    this.background = new Graphics();
    this.background.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.background.fill({ color: 0x000000, alpha: 0.7 });

    // Pause text
    this.pauseText = new Text({
      text: 'PAUSED',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 64,
        fill: COLORS.text,
        fontWeight: 'bold',
      },
    });
    this.pauseText.anchor.set(0.5);
    this.pauseText.x = CANVAS_WIDTH / 2;
    this.pauseText.y = CANVAS_HEIGHT / 2 - 40;

    // Instruction
    this.instructionText = new Text({
      text: 'Press SPACE to Resume',
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        fill: COLORS.textDark,
      },
    });
    this.instructionText.anchor.set(0.5);
    this.instructionText.x = CANVAS_WIDTH / 2;
    this.instructionText.y = CANVAS_HEIGHT / 2 + 40;

    this.container.addChild(this.background, this.pauseText, this.instructionText);
  }

  public show(): void {
    this.container.visible = true;
  }

  public hide(): void {
    this.container.visible = false;
  }
}
