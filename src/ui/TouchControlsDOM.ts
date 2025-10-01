import type { Direction } from "../entities/Snake";
import { Directions } from "../utils/Constants";

export class TouchControlsDOM {
  private container: HTMLDivElement | null = null;
  private pauseButton: HTMLButtonElement | null = null;
  private onDirectionCallback: ((direction: Direction) => void) | null = null;
  private onPauseCallback: (() => void) | null = null;

  constructor() {
    if (!this.isMobileDevice()) {
      return;
    }

    this.createControls();
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  private createControls(): void {
    // Create container for directional controls
    this.container = document.createElement("div");
    this.container.id = "touch-controls";
    this.container.style.cssText = `
      position: fixed;
      bottom: 15px;
      left: 15px;
      display: grid;
      grid-template-columns: repeat(3, 50px);
      grid-template-rows: repeat(3, 50px);
      gap: 8px;
      z-index: 1000;
      opacity: 0.85;
    `;

    // Create directional buttons
    const buttons = [
      { id: "up", row: 1, col: 2, direction: Directions.UP, label: "▲" },
      { id: "down", row: 3, col: 2, direction: Directions.DOWN, label: "▼" },
      { id: "left", row: 2, col: 1, direction: Directions.LEFT, label: "◀" },
      { id: "right", row: 2, col: 3, direction: Directions.RIGHT, label: "▶" },
    ];

    buttons.forEach((config) => {
      const button = this.createButton(
        config.id,
        config.row,
        config.col,
        config.direction,
        config.label
      );
      this.container!.appendChild(button);
    });

    // Create pause button (positioned on the right side)
    this.pauseButton = this.createPauseButton();

    // Add to DOM
    document.body.appendChild(this.container);
    document.body.appendChild(this.pauseButton);
  }

  private createPauseButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.id = "pause-button";
    button.innerHTML = "⏸";
    button.style.cssText = `
      position: fixed;
      bottom: 15px;
      right: 15px;
      width: 50px;
      height: 50px;
      border: 2px solid #4ecca3;
      background: rgba(58, 146, 121, 0.6);
      color: #eeeeee;
      font-size: 24px;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: all 0.1s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      opacity: 0.85;
    `;

    // Touch/click handlers
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      button.style.background = "rgba(78, 204, 163, 0.9)";
      button.style.transform = "scale(0.95)";
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      button.style.background = "rgba(58, 146, 121, 0.6)";
      button.style.transform = "scale(1)";

      if (this.onPauseCallback) {
        this.onPauseCallback();
      }
    });

    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      button.style.background = "rgba(58, 146, 121, 0.6)";
      button.style.transform = "scale(1)";
    });

    // Mouse support for testing
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      button.style.background = "rgba(78, 204, 163, 0.9)";
      button.style.transform = "scale(0.95)";
    });

    button.addEventListener("mouseup", (e) => {
      e.preventDefault();
      button.style.background = "rgba(58, 146, 121, 0.6)";
      button.style.transform = "scale(1)";

      if (this.onPauseCallback) {
        this.onPauseCallback();
      }
    });

    return button;
  }

  private createButton(
    id: string,
    row: number,
    col: number,
    direction: Direction,
    label: string
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.id = `touch-${id}`;
    button.textContent = label;
    button.style.cssText = `
      grid-row: ${row};
      grid-column: ${col};
      width: 50px;
      height: 50px;
      border: 2px solid #4ecca3;
      background: rgba(58, 146, 121, 0.6);
      color: #eeeeee;
      font-size: 20px;
      font-weight: bold;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: all 0.1s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    `;

    // Touch/click handlers
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.onButtonPress(button, direction);
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.onButtonRelease(button);
    });

    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.onButtonRelease(button);
    });

    // Also support mouse for testing
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.onButtonPress(button, direction);
    });

    button.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.onButtonRelease(button);
    });

    button.addEventListener("mouseleave", () => {
      this.onButtonRelease(button);
    });

    return button;
  }

  private onButtonPress(button: HTMLButtonElement, direction: Direction): void {
    // Visual feedback
    button.style.background = "rgba(78, 204, 163, 0.9)";
    button.style.transform = "scale(0.95)";
    button.style.borderColor = "#eeeeee";

    // Trigger direction callback
    if (this.onDirectionCallback) {
      this.onDirectionCallback(direction);
    }
  }

  private onButtonRelease(button: HTMLButtonElement): void {
    // Reset appearance
    button.style.background = "rgba(58, 146, 121, 0.6)";
    button.style.transform = "scale(1)";
    button.style.borderColor = "#4ecca3";
  }

  public onDirectionInput(callback: (direction: Direction) => void): void {
    this.onDirectionCallback = callback;
  }

  public onPauseInput(callback: () => void): void {
    this.onPauseCallback = callback;
  }

  public setPauseButtonIcon(isPaused: boolean): void {
    if (this.pauseButton) {
      this.pauseButton.innerHTML = isPaused ? "▶" : "⏸";
    }
  }

  public show(): void {
    if (this.container && this.isMobileDevice()) {
      this.container.style.display = "grid";
    }
    if (this.pauseButton && this.isMobileDevice()) {
      this.pauseButton.style.display = "block";
    }
  }

  public hide(): void {
    if (this.container) {
      this.container.style.display = "none";
    }
    if (this.pauseButton) {
      this.pauseButton.style.display = "none";
    }
  }

  public destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.pauseButton && this.pauseButton.parentNode) {
      this.pauseButton.parentNode.removeChild(this.pauseButton);
    }
  }
}
