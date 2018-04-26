import { Watcher } from "../watcher";
import { actions } from "../actions";
import { SimulationParams, Track } from "../types";
import { Store } from "../store";
import { formatAmount } from "../format";
import { unlocks } from "../unlocks";
import { sample } from "underscore";
import * as music from "../music";

export default function(w: Watcher) {
  w.on(actions.doActivity, (store, action) => {
    const { activity, clientX, clientY } = action.payload;
    let delta = activity.reward;
    if (activity.badRewardChance > 0) {
      if (Math.random() < activity.badRewardChance) {
        delta = activity.badReward;
      }
    }

    let text = `Earned $${formatAmount(delta)}`;
    if (delta < 0) {
      text = `Lost $${formatAmount(-delta)}`;
    }

    store.dispatch(
      actions.floaty({
        clientX,
        clientY,
        text,
      }),
    );
    store.dispatch(actions.moneyDelta({ delta }));
    if (activity.action) {
      store.dispatch(activity.action());
    }
  });

  w.on(actions.doExpense, (store, action) => {
    const { expense, clientX, clientY } = action.payload;
    if (spend(store, expense.cost)) {
      if (expense.action) {
        store.dispatch(expense.action());
      }
      if (expense.unlock) {
        store.dispatch(actions.unlock({ unlockName: expense.unlock }));
        const ul = unlocks[expense.unlock];
        store.dispatch(actions.floaty({ clientX, clientY, text: ul.label }));
      }
    } else {
      store.dispatch(
        actions.floaty({
          clientX,
          clientY,
          text: "Can't afford!",
        }),
      );
    }
  });

  w.on(actions.startPlayingPinball, (store, action) => {
    const { mapName } = action.payload;
    const resources = store.getState().resources;
    const params: SimulationParams = {
      codeSize: resources.codeSize,
      freq: resources.freq,
      mapName,
    };
    store.dispatch(actions.newSimulation({ params }));
  });

  // w.on(actions.boot, (store, action) => {
  //   let track = sample<Track>(store.getState().ui.tracks);
  //   store.dispatch(actions.nowPlaying({ track }));
  // });

  w.on(actions.nowPlaying, (store, action) => {
    const { track } = action.payload;
    music.setPlaying(track);
  });
}

function spend(store: Store, money: number): boolean {
  if (store.getState().resources.money >= money) {
    store.dispatch(actions.moneyDelta({ delta: -money }));
    return true;
  }
  return false;
}
