import reducer from "./reducer";
import { StatsState } from "../types";
import { actions } from "../actions";

export function defaultStats(): StatsState {
  return {
    money: 250000,
    freq: 2,
    numCols: 8,
    numRows: 2,
  };
}

const initialState: StatsState = defaultStats();

export default reducer<StatsState>(initialState, on => {});
