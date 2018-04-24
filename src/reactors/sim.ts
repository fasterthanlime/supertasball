import { actions } from "../actions";
import { Watcher } from "../watcher";
import { SimulationState } from "../types";
import { Store } from "../store";

export default function(w: Watcher) {
  w.on(actions.tick, (store, action) => {
    const oldState = store.getState().simulation;
    let state = {
      ...oldState,
      ticks: oldState.ticks + 1,
    };

    let freqTicks = 60 / state.freq;
    let ticksDelta = state.ticks - state.lastUpdateTicks;
    if (ticksDelta > freqTicks) {
      state = cpuStep(store, state);
      if (state.stepping) {
        state.stepping = false;
        state.paused = true;
      }
    }

    store.dispatch(actions.commitSimulationState({ state: state }));
  });
}

function cpuStep(store: Store, oldState: SimulationState) {
  let state = { ...oldState };

  const { code } = state;
  const op = code[state.pc];
  let nextPc = state.pc + 1;

  switch (op.type) {
    case "goto": {
      for (let i = 0; i < code.length; i++) {
        if (code[i].label == op.name) {
          nextPc = i;
          break;
        }
      }
      break;
    }
    case "freq": {
      if (op.numberValue > 0 && op.numberValue <= state.params.freq) {
        state.freq = op.numberValue;
      }
      break;
    }
  }
  store.dispatch(actions.execute({ op }));

  state.lastUpdateTicks = state.ticks;
  state.pc = nextPc % code.length;

  return state;
}
