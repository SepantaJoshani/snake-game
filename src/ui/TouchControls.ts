import { Container, Graphics, Text } from "pixi.js";
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from "../utils/Constants";
import type { Direction } from "../entities/Snake";
import { Directions } from "../utils/Constants";

export class TouchControls {
  public container: Container;
  private buttons: Map<string, { graphics: Graphics; direction: Direction }>;
  private buttonSize = 60;
  private buttonGap = 10;
  private onDirectionCallback: ((direction: Direction) => void) | null = null;

  constructor() {
    this.container = new Container();
    this.buttons = new Map();

    // Only show on mobile devices
    if (!this.isMobileDevice()) {
      this.container.visible = false;
      return;
    }

    this.createControls();
    this.setupInteraction();
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  private createControls(): void {
    const controlSize = this.buttonSize * 3 + this.buttonGap * 2;
    const startX = CANVAS_WIDTH - controlSize - 20;
    const startY = CANVAS_HEIGHT - controlSize - 20;

    // Create semi-transparent background
    const background = new Graphics();
    background.roundRect(
      startX - 10,
      startY - 10,
      controlSize + 20,
      controlSize + 20,
      15
    );
    background.fill({ color: 0x000000, alpha: 0.3 });
    this.container.addChild(background);

    // Create directional buttons in a cross pattern
    const buttonConfigs = [
      { id: "up", x: 1, y: 0, direction: Directions.UP, label: "▲" },
      { id: "down", x: 1, y: 2, direction: Directions.DOWN, label: "▼" },
      { id: "left", x: 0, y: 1, direction: Directions.LEFT, label: "◀" },
      { id: "right", x: 2, y: 1, direction: Directions.RIGHT, label: "▶" },
    ];

    buttonConfigs.forEach((config) => {
      const buttonX = startX + config.x * (this.buttonSize + this.buttonGap);
      const buttonY = startY + config.y * (this.buttonSize + this.buttonGap);

      const button = this.createButton(
        buttonX,
        buttonY,
        config.label,
        config.direction
      );
      this.buttons.set(config.id, {
        graphics: button,
        direction: config.direction,
      });
      this.container.addChild(button);
    });
  }

  private createButton(
    x: number,
    y: number,
    label: string,
    direction: Direction
  ): Graphics {
    const button = new Graphics();

    // Draw button background
    button.roundRect(0, 0, this.buttonSize, this.buttonSize, 10);
    button.fill({ color: COLORS.snakeBody, alpha: 0.6 });
    button.stroke({ color: COLORS.snakeHead, width: 2, alpha: 0.8 });

    // Add label
    const text = new Text({
      text: label,
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        fill: COLORS.text,
        fontWeight: "bold",
      },
    });
    text.anchor.set(0.5);
    text.x = this.buttonSize / 2;
    text.y = this.buttonSize / 2;
    button.addChild(text);

    button.x = x;
    button.y = y;

    // Make interactive
    button.eventMode = "static";
    button.cursor = "pointer";

    // Store direction on the button for later use
    (button as any).direction = direction;

    return button;
  }

  private setupInteraction(): void {
    this.buttons.forEach((buttonData) => {
      const button = buttonData.graphics;
      const direction = buttonData.direction;

      // Touch/click handlers
      button.on("pointerdown", () => {
        this.onButtonPress(button, direction);
      });

      button.on("pointerup", () => {
        this.onButtonRelease(button);
      });

      button.on("pointerupoutside", () => {
        this.onButtonRelease(button);
      });
    });
  }

  private onButtonPress(button: Graphics, direction: Direction): void {
    // Visual feedback - brighten button
    button.clear();
    button.roundRect(0, 0, this.buttonSize, this.buttonSize, 10);
    button.fill({ color: COLORS.snakeHead, alpha: 0.9 });
    button.stroke({ color: COLORS.text, width: 2, alpha: 1 });

    // Trigger direction callback
    if (this.onDirectionCallback) {
      this.onDirectionCallback(direction);
    }
  }

  private onButtonRelease(button: Graphics): void {
    // Reset button appearance
    button.clear();
    button.roundRect(0, 0, this.buttonSize, this.buttonSize, 10);
    button.fill({ color: COLORS.snakeBody, alpha: 0.6 });
    button.stroke({ color: COLORS.snakeHead, width: 2, alpha: 0.8 });

    // Re-add the label (it was cleared)
    const text = button.children[0] as Text;
    if (text) {
      button.addChild(text);
    }
  }

  public onDirectionInput(callback: (direction: Direction) => void): void {
    this.onDirectionCallback = callback;
  }

  public show(): void {
    if (this.isMobileDevice()) {
      this.container.visible = true;
    }
  }

  public hide(): void {
    this.container.visible = false;
  }

  public setVisible(visible: boolean): void {
    if (this.isMobileDevice()) {
      this.container.visible = visible;
    }
  }
}
