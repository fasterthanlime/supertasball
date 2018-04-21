import { Watcher } from "./watcher";
import { Store } from "./store";
import { Action } from "./types";

const emptyArr = [];

function err(e: Error, action: Action<any>) {
  console.error(
    `while reacting to ${(action || { type: "?" }).type}: ${e.stack || e}`,
  );
}

function route(watcher: Watcher, store: Store, action: Action<any>): void {
  setTimeout(() => {
    (async () => {
      let promises = [];

      for (const r of watcher.reactors[action.type] || emptyArr) {
        promises.push(r(store, action));
      }

      for (const sub of watcher.subs) {
        if (!sub) {
          continue;
        }

        for (const r of sub.reactors[action.type] || emptyArr) {
          promises.push(r(store, action));
        }
      }
      await Promise.all(promises);
    })().catch(e => {
      err(e, action);
    });
  }, 0);
  return;
}

export default route;
