import { actions } from "./actions";
import { UnlockName } from "./unlocks";
import { Action } from "./types";

export interface Expense {
  requires?: UnlockName[];
  unlock?: UnlockName;

  // e.g. "Play dice"
  label: string;

  // in $
  cost: number;

  action?: () => Action<any>;
}

const _ = (e: Expense) => e;

export const expenses: Expense[] = [
  {
    label: "Play pinball",
    cost: 3.5,
    action: () => actions.playPinball({}),
  },
  // -------- cpu upgrades
  {
    label: "Buy a 4Hz CPU",
    cost: 250,
    unlock: "cpu4",
  },
  {
    label: "Buy a 8Hz CPU",
    cost: 400,
    requires: ["cpu4"],
    unlock: "cpu8",
  },
  {
    label: "Buy a 16Hz CPU",
    cost: 800,
    requires: ["cpu8"],
    unlock: "cpu16",
  },
  {
    label: "Buy a 30Hz CPU",
    cost: 1200,
    requires: ["cpu16"],
    unlock: "cpu30",
  },
  {
    label: "Buy a 60Hz CPU",
    cost: 2000,
    requires: ["cpu30"],
    unlock: "cpu60",
  },
  // -------- ROM upgrades
  {
    label: "Buy a 20-op ROM",
    cost: 100,
    unlock: "rom20",
  },
  {
    label: "Buy a 40-op ROM",
    cost: 200,
    requires: ["rom20"],
    unlock: "rom40",
  },
  {
    label: "Buy a 100-op ROM",
    cost: 600,
    requires: ["rom40"],
    unlock: "rom100",
  },
  {
    label: "Buy a 250-op ROM",
    cost: 1400,
    requires: ["rom100"],
    unlock: "rom250",
  },
];
