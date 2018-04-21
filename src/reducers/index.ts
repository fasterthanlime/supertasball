import { RootState } from "../types";
import { Action } from "redux";
import reducer from "./reducer";
import { actions } from "../actions";

const initialState: RootState = {
  page: "game",
  paused: true,
  money: 250000,
  freq: 2,
  numCols: 8,
  numRows: 2,
  ticks: 0,
  lastUpdateTicks: 0,

  col: 0,
  row: 0,
};

export default reducer<RootState>(initialState, on => {
  on(actions.setPage, (state, action) => {
    return {
      ...state,
      page: action.payload.page,
    };
  });

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

    let freqTicks = 60 / newState.freq;
    let ticksDelta = newState.ticks - newState.lastUpdateTicks;
    if (ticksDelta > freqTicks) {
      newState = cpuStep(newState);
    }
    return newState;
  });
});

function cpuStep(state: RootState) {
  let newState = { ...state };

  if (newState.col >= newState.numCols - 1) {
    newState.col = 0;
    if (newState.row >= newState.numRows - 1) {
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
