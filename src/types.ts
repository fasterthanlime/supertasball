export interface RootState {
  page: Page;
  paused: boolean;
  money: number;
  freq: number;
  numCols: number;
  numRows: number;
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
