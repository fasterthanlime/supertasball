import { Results, SimulationState } from "./types";
import { Map } from "./components/map";
import store from "./store";
import simulation from "./reducers/simulation";

export function getCashReward(results: Results): number {
  let reward = results.score * 0.5;
  if (reward < 0) {
    reward = 0;
  }
  return reward;
}

export function computeResults(
  map: Map,
  simulationState: SimulationState,
): Results {
  let score = 0;
  let time = map.ticks * 1 / 60;

  let timeScorePenalty = 0;
  if (simulationState.params.gameMode == "time") {
    timeScorePenalty = Math.floor(time * 0.5);
  }
  score -= timeScorePenalty;

  for (const k of Object.keys(map.groups)) {
    const g = map.groups[k];
    for (let i = 0; i < g.hit; i++) {
      score += g.singlePoints;
    }
    if (g.hit >= g.total) {
      score += g.comboPoints;
    }
  }

  const { dirty } = simulationState;
  return {
    score,
    time: time,
    groups: map.groups,
    timeScorePenalty,
    dirty,
  };
}
