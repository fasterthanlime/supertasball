import { createStore } from "redux";
import reducer from "./reducers/index";
import { RootState, Action } from "./types";

const store = createStore<RootState, Action<any>, any, any>(reducer);
export default store;
