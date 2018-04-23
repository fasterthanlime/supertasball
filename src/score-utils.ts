import { Results } from "./types";

export function getCashReward(results: Results): number {
  let reward = results.score * 0.2;
  if (reward < 0) {
    reward = 0;
  }
  return reward;
}
