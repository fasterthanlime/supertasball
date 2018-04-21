import reducer from "./reducer";
import { StatsState } from "../types";
import { actions } from "../actions";

export function defaultStats(): StatsState {
  return {
    money: 0,
    freq: 4,
    numCols: 8,
    numRows: 4,
  };
}

const initialState: StatsState = defaultStats();

export default reducer<StatsState>(initialState, on => {
  on(actions.execute, (state, action) => {
    return {
      ...state,
      money: state.money + 5,
    };
  });
});
