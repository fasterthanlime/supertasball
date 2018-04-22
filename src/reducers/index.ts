import { RootState, SimulationState } from "../types";
import { Action, combineReducers } from "redux";
import reducer from "./reducer";
import { actions } from "../actions";

import ui from "./ui";
import simulation from "./simulation";
import resources from "./resources";

export default combineReducers({
  ui,
  simulation,
  resources,
});
