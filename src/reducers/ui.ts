import reducer from "./reducer";
import { UIState } from "../types";
import { actions } from "../actions";

const initialState: UIState = {
  page: "game",
};

export default reducer<UIState>(initialState, on => {
  on(actions.setPage, (state, action) => {
    return {
      ...state,
      page: action.payload.page,
    };
  });

  on(actions.editCell, (state, action) => {
    return {
      ...state,
      editedCell: action.payload.editedCell,
    };
  });
});
