import { ResourcesState } from "./types";

export interface Unlock {
  label: string;
  effects: Partial<ResourcesState>;
}

export interface Unlocks {
  [key: string]: Unlock;
}

export const unlocks: Unlocks = {
  brave: {
    label: "You're brave enough to play TASball!",
    effects: {},
  },

  // CPU upgrades
  cpu4: {
    label: "You bought a 4Hz CPU!",
    effects: {
      freq: 4,
    },
  },
  cpu8: {
    label: "You bought a 8Hz CPU!",
    effects: {
      freq: 8,
    },
  },
  cpu16: {
    label: "You bought a 16Hz CPU!",
    effects: {
      freq: 16,
    },
  },
  cpu30: {
    label: "You bought a 30Hz CPU!",
    effects: {
      freq: 30,
    },
  },
  cpu60: {
    label: "You bought a 60Hz CPU!",
    effects: {
      freq: 60,
    },
  },

  // ROM upgrades
  rom20: {
    label: "You bought a 20-op ROM!",
    effects: {
      codeSize: 20,
    },
  },
  rom40: {
    label: "You bought a 40-op ROM!",
    effects: {
      codeSize: 40,
    },
  },
  rom100: {
    label: "You bought a 100-op ROM!",
    effects: {
      codeSize: 100,
    },
  },
  rom250: {
    label: "You bought a 250-op ROM!",
    effects: {
      codeSize: 250,
    },
  },
};

export type UnlockName = keyof typeof unlocks;
