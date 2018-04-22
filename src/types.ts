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

export interface CellSelection {
  start: number;
  size: number;
}

export interface UIState {
  page: Page;
  editedCell?: EditedCell;
  cellSelection: CellSelection;
  floaties: Floaties;
  showCode: boolean;
}

export interface Floaties {
  [key: string]: Floaty;
}

export interface Floaty {
  clientX: number;
  clientY: number;
  text: string;
}

export interface EditedCell {
  addr: number;
}

export interface SimulationState {
  params: SimulationParams;

  paused: boolean;
  stepping: boolean;
  ticks: number;
  lastUpdateTicks: number;

  freq: number;
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

interface Choice {
  label: string;
  value: string;
}

interface OpCodeDef {
  label: string;
  relevantFields: {
    name?: {
      choices?: Choice[];
      freeInput?: string;
    };
    boolValue?: string;
    numberValue?: string;
  };
}

const op = (def: OpCodeDef) => def;

export const OpCodeTypes = {
  nop: op({
    label: "NOP: Do nothing",
    relevantFields: {},
  }),
  flip: op({
    label: "FLIP: Set flipper state",
    relevantFields: {
      name: {
        choices: [
          { label: "Left flipper", value: "left" },
          { label: "Right flipper", value: "right" },
        ],
      },
      boolValue: `enabled`,
    },
  }),
  goto: op({
    label: "GOTO: Unconditional jump",
    relevantFields: {
      name: { freeInput: `label to jump to` },
    },
  }),
  freq: op({
    label: "FREQ: Set frequency",
    relevantFields: {
      numberValue: `new cpu frequency in Hz`,
    },
  }),
  note: op({
    label: "NOTE: Write to note channel",
    relevantFields: {
      name: {
        choices: [
          { label: "channel 1", value: "0" },
          { label: "channel 2", value: "1" },
          { label: "channel 3", value: "2" },
          { label: "channel 4", value: "3" },
        ],
      },
      numberValue: `note frequency in Hz`,
      boolValue: `playing`,
    },
  }),
};
export type OpCodeType = keyof typeof OpCodeTypes;

export interface OpCode {
  type: OpCodeType;
  name?: string;
  boolValue?: boolean;
  numberValue?: number;
  label?: string;
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
