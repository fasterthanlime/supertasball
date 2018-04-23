import reducer from "./reducer";
import { UIState } from "../types";
import { actions } from "../actions";

const initialState: UIState = {
  page: "game",
  showCode: true,
  floaties: {},
  cellSelection: { start: 0, size: 0 },
};

let floatySeed = 0;

export default reducer<UIState>(initialState, on => {
  on(actions.setPage, (state, action) => {
    return {
      ...state,
      page: action.payload.page,
    };
  });

  on(actions.floaty, (state, action) => {
    return {
      ...state,
      floaties: {
        ...state.floaties,
        // this is very anti-redux, do not read
        [floatySeed++]: action.payload,
      },
    };
  });

  on(actions.floatyKill, (state, action) => {
    let floaties = { ...state.floaties };
    delete floaties[action.payload.id];

    return {
      ...state,
      floaties,
    };
  });

  on(actions.setShowCode, (state, action) => {
    return {
      ...state,
      showCode: action.payload.showCode,
    };
  });

  on(actions.setCellSelection, (state, action) => {
    return { ...state, cellSelection: action.payload };
  });
});
