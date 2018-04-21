import { RootState } from "../types";
import { Action } from "redux";
import reducer from "./reducer";
import { actions } from "../actions";

const initialState: RootState = {
  page: "menu"
};

export default reducer<RootState>(initialState, on => {
  on(actions.setPage, (state, action) => {
    return {
      ...state,
      page: action.payload.page
    };
  });
});
