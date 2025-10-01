import { GameStates } from "../utils/Constants";

export type GameStateType = (typeof GameStates)[keyof typeof GameStates];

export class GameState {
  private currentState: GameStateType;
  private listeners: Map<GameStateType, (() => void)[]>;

  constructor(initialState: GameStateType = GameStates.MENU) {
    this.currentState = initialState;
    this.listeners = new Map();
  }

  public getCurrentState(): GameStateType {
    return this.currentState;
  }

  public transition(newState: GameStateType): void {
    if (this.currentState === newState) {
      return;
    }

    this.onExit(this.currentState);
    this.currentState = newState;
    this.onEnter(newState);
  }

  public onStateChange(state: GameStateType, callback: () => void): void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, []);
    }
    this.listeners.get(state)!.push(callback);
  }

  private onEnter(state: GameStateType): void {
    const callbacks = this.listeners.get(state);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }

  private onExit(_state: GameStateType): void {
    // Can add exit callbacks if needed
  }
}
