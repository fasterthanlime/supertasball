import { createStore } from "redux";
import reducer from "./reducers/index";
import { RootState, Action } from "./types";
import { Watcher } from "./watcher";
import route from "./route";

export interface Store {
  watcher: Watcher;
  dispatch: (action: Action<any>) => void;
}

const watcher = new Watcher();

const store = createStore<RootState, Action<any>, any, any>(reducer) as Store;

let storeDotDispatch = store.dispatch;
store.dispatch = function(action: Action<any>) {
  storeDotDispatch.call(this, action);
  route(watcher, store, action);
};
store.watcher = watcher;

export default store;
