import { actions } from "../actions";
import { Watcher } from "../watcher";
import { SimulationState } from "../types";
import { Store } from "../store";

export default function(w: Watcher) {
  w.on(actions.tick, async (store, action) => {
    const oldState = store.getState().simulation;
    let state = {
      ...oldState,
      ticks: oldState.ticks + 1,
    };

    let freqTicks = 60 / state.params.freq;
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

  state.pc++;
  if (state.pc >= state.code.length) {
    state.pc = 0;
  }
  state.lastUpdateTicks = state.ticks;

  // ooh ahh don't do that in redux!
  let op = state.code[state.pc];
  store.dispatch(actions.execute({ op }));

  return state;
}
