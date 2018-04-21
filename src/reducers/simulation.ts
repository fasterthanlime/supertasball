import reducer from "./reducer";
import { SimulationState, StatsState } from "../types";
import { actions } from "../actions";
import { defaultStats } from "./stats";

function freshSimulationState(stats: StatsState): SimulationState {
  return {
    currentStats: stats,
    paused: true,
    ticks: 0,
    lastUpdateTicks: 0,
    col: 0,
    row: 0,
  };
}

const initialState = freshSimulationState(defaultStats());

export default reducer<SimulationState>(initialState, on => {
  on(actions.setPaused, (state, action) => {
    return {
      ...state,
      paused: action.payload.paused,
    };
  });

  on(actions.tick, (state, action) => {
    let newState = {
      ...state,
      ticks: state.ticks + 1,
    };

    let freqTicks = 60 / newState.currentStats.freq;
    let ticksDelta = newState.ticks - newState.lastUpdateTicks;
    if (ticksDelta > freqTicks) {
      newState = cpuStep(newState);
    }
    return newState;
  });

  on(actions.refresh, (state, action) => {
    return freshSimulationState(state.currentStats);
  });
});

function cpuStep(state: SimulationState) {
  let newState = { ...state };

  if (newState.col >= newState.currentStats.numCols - 1) {
    newState.col = 0;
    if (newState.row >= newState.currentStats.numRows - 1) {
      newState.row = 0;
    } else {
      newState.row++;
    }
  } else {
    newState.col++;
  }
  newState.lastUpdateTicks = newState.ticks;

  return newState;
}
