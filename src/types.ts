export interface RootState {
  ui: UIState;
  resources: ResourcesState;
  simulation: SimulationState;
}

export interface ResourcesState {
  freq: number;
  codeSize: number;
  money: number;
}

export interface UIState {
  page: Page;
  editedCell?: EditedCell;
}

export interface EditedCell {}

export interface SimulationState {
  params: SimulationParams;

  paused: boolean;
  ticks: number;
  lastUpdateTicks: number;

  code: OpCode[];
  pc: number;
}

export interface SimulationParams {
  money: number;
  freq: number;
  codeSize: number;
}

export interface OpCode {
  type: "nop" | "writeFlipper";
  name?: string;
  boolValue?: boolean;
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
