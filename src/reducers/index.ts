import { RootState } from "../types";
import { Action } from "redux";
import reducer from "./reducer";
import { actions } from "../actions";

const initialState: RootState = {
  page: "game",
  paused: true,
  money: 250000,
  freq: 1,
  numColumns: 8,
  numRows: 2,
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
});
