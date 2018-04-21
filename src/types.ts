export interface RootState {
  page: Page;
  paused: boolean;
  money: number;
  freq: number;
  numColumns: number;
  numRows: number;
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
