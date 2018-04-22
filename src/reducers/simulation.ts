import reducer from "./reducer";
import { SimulationState, OpCode, SimulationParams } from "../types";
import { actions } from "../actions";
import store from "../store";

function freshSimulationState(params: SimulationParams): SimulationState {
  let code: OpCode[] = [];
  code.length = params.codeSize;

  let boolValue = true;
  for (let i = 0; i < params.codeSize; i++) {
    code[i] = { type: "nop" };
  }

  code[3] = {
    type: "writeFlipper",
    name: "right",
    boolValue: true,
  };
  code[12] = {
    type: "writeFlipper",
    name: "right",
    boolValue: false,
  };
  code[13] = {
    type: "writeFlipper",
    name: "left",
    boolValue: true,
  };

  return {
    params: params,
    paused: true,
    ticks: 0,
    lastUpdateTicks: 0,
    pc: 0,
    code,
  };
}

export default reducer<SimulationState>(null, on => {
  on(actions.newSimulation, (state, action) => {
    const { params } = action.payload;
    return freshSimulationState(params);
  });

  on(actions.setPaused, (state, action) => {
    return {
      ...state,
      paused: action.payload.paused,
    };
  });

  on(actions.tick, (state, action) => {
    let newState = {
      ...state,
      ticks: state.ticks + 1,
    };

    let freqTicks = 60 / newState.params.freq;
    let ticksDelta = newState.ticks - newState.lastUpdateTicks;
    if (ticksDelta > freqTicks) {
      newState = cpuStep(newState);
    }
    return newState;
  });

  on(actions.refresh, (state, action) => {
    return freshSimulationState(state.params);
  });
});

function cpuStep(oldState: SimulationState) {
  let state = { ...oldState };

  state.pc++;
  if (state.pc >= state.code.length) {
    state.pc = 0;
  }
  state.lastUpdateTicks = state.ticks;

  setTimeout(() => {
    // ooh ahh don't do that in redux!
    let op = state.code[state.pc];
    store.dispatch(actions.execute({ op }));
  }, 0);

  return state;
}
