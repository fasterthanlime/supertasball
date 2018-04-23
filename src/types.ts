import { Store } from "./store";

export interface RootState {
  ui: UIState;
  resources: ResourcesState;
  simulation: SimulationState;
}

export interface Unlocked {
  [key: string]: boolean;
}

export interface ResourcesState {
  freq: number;
  codeSize: number;
  money: number;
  unlocked: Unlocked;
}

export interface CellSelection {
  start: number;
  size: number;
}

export interface UIState {
  page: Page;
  cellSelection: CellSelection;
  floaties: Floaties;
  showCode: boolean;
  clipboard: Clipboard;
  pickingMap: boolean;
}

export interface Clipboard {
  ops: OpCode[];
}

export interface Floaties {
  [key: string]: Floaty;
}

export interface Floaty {
  clientX: number;
  clientY: number;
  text: string;
}

export interface SimulationState {
  params: SimulationParams;

  paused: boolean;
  stepping: boolean;
  ticks: number;
  lastUpdateTicks: number;
  results: Results | null;

  freq: number;
  code: OpCode[];
  pc: number;
}

export interface Results {
  groups: Groups;
  // in seconds
  time: number;
  score: number;
  timeScorePenalty: number;
}

export interface SimulationParams {
  freq: number;
  codeSize: number;
  mapName: MapName;
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
import { MapName } from "./map-defs";
import { Groups } from "./components/map";
import { UnlockName } from "./unlocks";

interface Choice {
  label: string;
  value: string;
}

export interface OpCodeDef {
  label: string;
  icon: string;
  relevantFields: {
    name?: {
      label: string;
      choices?: Choice[];
    };
    boolValue?: string;
    numberValue?: {
      label: string;
      unit: string;
      defaultValue: number;
    };
  };
}

const op = (def: OpCodeDef) => def;

export const OpCodeTypes = {
  nop: op({
    label: "Nop",
    icon: "chevron-right",
    relevantFields: {},
  }),
  motor: op({
    label: "Motor control",
    icon: "settings",
    relevantFields: {
      name: {
        label: "Which flipper to activate",
        choices: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
      boolValue: `Enable/disable flipper motor`,
    },
  }),
  goto: op({
    label: "Goto",
    icon: "corner-right-down",
    relevantFields: {
      name: { label: "Which label to jump to" },
    },
  }),
  freq: op({
    label: "Set frequency",
    icon: "activity",
    relevantFields: {
      numberValue: {
        label: "CPU frequency",
        unit: "Hz",
        defaultValue: 4,
      },
    },
  }),
  note: op({
    label: "Play/pause note",
    icon: "music",
    relevantFields: {
      name: {
        label: "Channel to use",
        choices: [
          { label: "Ch 0", value: "0" },
          { label: "Ch 1", value: "1" },
          { label: "Ch 2", value: "2" },
          { label: "Ch 3", value: "3" },
        ],
      },
      numberValue: {
        label: "Note frequency",
        unit: "Hz",
        defaultValue: 440,
      },
      boolValue: `Play or mute sound channel`,
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
