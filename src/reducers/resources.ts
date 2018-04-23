import reducer from "./reducer";
import { ResourcesState } from "../types";
import { actions } from "../actions";
import { getCashReward } from "../score-utils";
import { unlocks } from "../unlocks";

const initialState: ResourcesState = {
  money: 5,
  codeSize: 10,
  freq: 1,
  unlocked: {},
};

let cheat = document.location.search.startsWith("?cheat");
if (cheat) {
  initialState.money = 30000;
}

export default reducer<ResourcesState>(initialState, on => {
  on(actions.moneyDelta, (state, action) => {
    return {
      ...state,
      money: state.money + action.payload.delta,
    };
  });

  on(actions.validateStage, (state, action) => {
    const { results } = action.payload;
    return {
      ...state,
      money: state.money + getCashReward(results),
    };
  });

  on(actions.unlock, (state, action) => {
    const { unlockName } = action.payload;
    const unlock = unlocks[unlockName];

    if (unlock.effects) {
      state = {
        ...state,
        ...unlock.effects,
      };
    }

    state = {
      ...state,
      unlocked: {
        ...state.unlocked,
        [unlockName]: true,
      },
    };
    return state;
  });
});
