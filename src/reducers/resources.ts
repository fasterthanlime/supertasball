import reducer from "./reducer";
import { ResourcesState } from "../types";
import { actions } from "../actions";

const initialState: ResourcesState = {
  money: 2,
  codeSize: 20,
  freq: 1,
};

export default reducer<ResourcesState>(initialState, on => {
  on(actions.moneyDelta, (state, action) => {
    return {
      ...state,
      money: state.money + action.payload.delta,
    };
  });
});
