import { actions } from "../actions";
import { Watcher } from "../watcher";
import { SimulationState, CPUState, Code, SimulationParams } from "../types";
import { Store } from "../store";

export default function(w: Watcher) {
  w.on(actions.tick, (store, action) => {
    const { cpuState, code, params, stepping } = store.getState().simulation;

    const oldState = cpuState;
    let state = {
      ...oldState,
      ticks: oldState.ticks + 1,
    };

    let freqTicks = 60 / state.freq;
    let ticksDelta = state.ticks - state.lastUpdateTicks;
    if (ticksDelta > freqTicks) {
      state = cpuStep(store, code, params, state);
      if (stepping) {
        store.dispatch(actions.setPaused({ paused: true }));
        store.dispatch(actions.setStepping({ stepping: false }));
      }
    }

    store.dispatch(actions.commitCPUState({ state }));
  });
}

export function cpuStep(
  store: Store,
  code: Code,
  params: SimulationParams,
  oldState: CPUState,
): CPUState {
  let state = { ...oldState };

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
      if (op.numberValue > 0 && op.numberValue <= params.freq) {
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
