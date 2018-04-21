export interface RootState {
  ui: UIState;
  stats: StatsState;
  simulation: SimulationState;
}

export interface StatsState {
  money: number;
  freq: number;
  numCols: number;
  numRows: number;
}

export interface UIState {
  page: Page;
}

export interface SimulationState {
  currentStats: StatsState;

  paused: boolean;
  ticks: number;
  lastUpdateTicks: number;
  col: number;
  row: number;
}

export type Page = "menu" | "game";

export interface Action<T> {
  type: string;
  payload: T;
}

export interface ActionCreator<T> {
  (t: T): Action<T>;
  payload: T;
}

export type Dispatch = (a: Action<any>) => void;
