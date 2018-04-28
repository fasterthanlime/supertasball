import { createStore } from "redux";
import reducer from "./reducers/index";
import { RootState, Action } from "./types";
import { Watcher } from "./watcher";
import route from "./route";
import getWatcher from "./reactors";

export interface Store {
  watcher: Watcher;
  dispatch: (action: Action<any>) => void;
  getState: () => RootState;
}

const watcher = getWatcher();

const store = createStore<RootState, Action<any>, any, any>(reducer) as Store;

let storeDotDispatch = store.dispatch;
store.dispatch = function(action: Action<any>) {
  storeDotDispatch.call(this, action);
  route(watcher, store, action);
};
store.watcher = watcher;

if (typeof window !== undefined) {
  (window as any).ReduxStore = store;
}

export default store;
