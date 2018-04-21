import reducer from "./reducer";
import { SimulationState, StatsState, Instruction } from "../types";
import { actions } from "../actions";
import { defaultStats } from "./stats";
import store from "../store";

function freshSimulationState(stats: StatsState): SimulationState {
  let instructions: Instruction[] = [];
  let numCells = stats.numCols * stats.numRows;
  instructions.length = numCells;

  let boolValue = true;
  for (let i = 0; i < numCells; i++) {
    let ins: Instruction = {
      type: "nop",
    };
    instructions[i] = ins;
  }

  instructions[3] = {
    type: "writeFlipper",
    name: "right",
    boolValue: true,
  };
  instructions[12] = {
    type: "writeFlipper",
    name: "right",
    boolValue: false,
  };
  instructions[13] = {
    type: "writeFlipper",
    name: "left",
    boolValue: true,
  };

  return {
    currentStats: stats,
    paused: true,
    ticks: 0,
    lastUpdateTicks: 0,
    col: 0,
    row: 0,
    instructions,
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
  const stats = newState.currentStats;

  if (newState.col >= stats.numCols - 1) {
    newState.col = 0;
    if (newState.row >= stats.numRows - 1) {
      newState.row = 0;
    } else {
      newState.row++;
    }
  } else {
    newState.col++;
  }
  newState.lastUpdateTicks = newState.ticks;

  setTimeout(() => {
    // ooh ahh don't do that in redux!
    let instruction =
      state.instructions[newState.col + newState.row * stats.numCols];

    store.dispatch(actions.execute({ instruction }));
  }, 0);

  return newState;
}
