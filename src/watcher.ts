import { each } from "underscore";

import { Store } from "./store";
import { Action, RootState } from "./types";
import { actions } from "./actions";

interface IReactor<T> {
  (store: Store, action: Action<T>): Promise<void>;
}

interface Schedule {
  (f: () => void): void;
  dispatch?: (a: Action<any>) => void;
}
type Selector = (rs: RootState) => void;
type SelectorMaker = (store: Store, schedule: Schedule) => Selector;

/**
 * Allows reacting to certain actions being dispatched
 */
export class Watcher {
  reactors: {
    [key: string]: IReactor<any>[];
  };

  subs: Watcher[];

  constructor() {
    this.reactors = {};
    this.subs = [];
  }

  /**
   * Registers a reactor for a given action
   */
  on<T>(
    actionCreator: (payload: T) => Action<T>,
    reactor: (store: Store, action: Action<T>) => Promise<void>,
  ) {
    // create a dummy action to get the type
    const type = actionCreator(({} as any) as T).type;
    this.addWatcher(type, reactor);
  }

  validate() {
    each(Object.keys(this.reactors), key => {
      if (!actions.hasOwnProperty(key)) {
        throw new Error(`trying to react to unknown action type ${key}`);
      }
    });
  }

  addSub(watcher: Watcher) {
    this.subs.push(watcher);
  }

  removeSub(watcher: Watcher) {
    const index = this.subs.indexOf(watcher);
    if (index !== -1) {
      this.subs.splice(index, 1);
    }
  }

  protected addWatcher(type: string, reactor: IReactor<any>) {
    if (!this.reactors[type]) {
      this.reactors[type] = [];
    }
    this.reactors[type].push(reactor);
  }
}
