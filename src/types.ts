import { Store } from "./store";

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
  floaties: Floaties;
}

export interface Floaties {
  [key: string]: Floaty;
}

export interface Floaty {
  clientX: number;
  clientY: number;
  text: string;
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
  freq: number;
  codeSize: number;
}

export interface Activity {
  // e.g. "Play dice"
  label: string;

  // in $
  reward: number;

  // also in $
  badReward?: number;
  // can be 0/undefined, in [0,1]
  badRewardChance?: number;

  // milliseconds, can be 0
  delay?: number;

  action?: () => Action<any>;
}

import { expenses } from "./expenses";

export interface Expense {
  prereq?: string;

  // e.g. "Play dice"
  label: string;

  // in $
  cost: number;

  action?: () => Action<any>;
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
