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

export interface Track {
  url: string;
  title: string;
  artist: string;
}

export interface UIState {
  cellSelection: CellSelection;
  floaties: Floaties;
  showCode: boolean;
  clipboard: Clipboard;
  pickingMap: boolean;
  showAchievements: boolean;
  showHelp: boolean;
  tracks: Track[];
  activeTrack?: Track;
  playlist: number[];
  playlistIndex: number;
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

  dirty: boolean;

  undoStack: OpCode[][];
}

export interface Results {
  groups: Groups;
  // in seconds
  time: number;
  score: number;
  timeScorePenalty: number;
  dirty: boolean;
}

export type GameMode = "score" | "time" | "gold";

export interface SimulationParams {
  freq: number;
  codeSize: number;
  mapName: MapName;
  gameMode: GameMode;
}

export const gameModeDefs = {
  score: {
    name: "High score",
    description: "Make the game last as long as you can and get a high score.",
  },
  time: {
    name: "Speedrun",
    description: "Finish as soon as you can while still hitting all targets.",
  },
  golf: {
    name: "Code golf",
    description:
      "Use the fewest instructions possible while still hitting all target",
  },
};

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
};

export type OpCodeType = keyof typeof OpCodeTypes;

export interface OpCode {
  type: OpCodeType;
  name?: string;
  boolValue?: boolean;
  numberValue?: number;
  label?: string;
}

export interface Action<T> {
  type: string;
  payload: T;
}

export interface ActionCreator<T> {
  (t: T): Action<T>;
  payload: T;
}

export type Dispatch = (a: Action<any>) => void;
