import { Activity } from "./types";
import { actions } from "./actions";

const _ = (a: Activity) => a;

export const activities = {
  PlayDice: _({
    label: "Play dice",
    reward: 0.1,
    badReward: -0.5,
    badRewardChance: 0.1,
  }),
  WashWindow: _({
    label: "Wash window",
    reward: 5,
    delay: 1000,
  }),
  MowLawn: _({
    label: "Mow lawn",
    reward: 20,
    delay: 3000,
  }),
  StealCar: _({
    label: "Steal car",
    reward: 900,
    badReward: -25000,
    badRewardChance: 0.6,
    delay: 15000,
  }),
  MineSatoshi: _({
    label: "Mine satoshi",
    reward: 0.01,
    delay: 1000000,
  }),
};
