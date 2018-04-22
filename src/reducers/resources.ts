import reducer from "./reducer";
import { ResourcesState } from "../types";
import { actions } from "../actions";

const initialState: ResourcesState = {
  money: 5,
  codeSize: 20,
  freq: 1,
};

let cheat = true;
if (cheat) {
  initialState.freq = 16;
  initialState.money = 10000;
  initialState.codeSize = 50;
}

export default reducer<ResourcesState>(initialState, on => {
  on(actions.moneyDelta, (state, action) => {
    return {
      ...state,
      money: state.money + action.payload.delta,
    };
  });
});
