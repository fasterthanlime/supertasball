import reducer from "./reducer";
import { SimulationState, OpCode, SimulationParams } from "../types";
import { actions } from "../actions";
import store from "../store";

function freshSimulationState(
  params: SimulationParams,
  code: OpCode[] | null,
): SimulationState {
  if (!code) {
    code = [];
    code.length = params.codeSize;
    for (let i = 0; i < params.codeSize; i++) {
      code[i] = { type: "nop" };
    }
  }

  return {
    params: params,
    paused: true,
    ticks: 0,
    lastUpdateTicks: 0,
    pc: 0,
    stepping: false,
    code,
    freq: params.freq,
    results: null,
  };
}

export default reducer<SimulationState>(null, on => {
  on(actions.newSimulation, (state, action) => {
    const { params } = action.payload;
    return freshSimulationState(params, null);
  });

  on(actions.setPaused, (state, action) => {
    return {
      ...state,
      paused: action.payload.paused,
    };
  });

  on(actions.commitSimulationState, (state, action) => {
    return action.payload.state;
  });

  on(actions.exitSimulation, (state, action) => {
    return null;
  });

  on(actions.reset, (state, action) => {
    return freshSimulationState(state.params, state.code);
  });

  on(actions.stepForward, (state, action) => {
    return {
      ...state,
      paused: false,
      stepping: true,
    };
  });

  on(actions.commitCell, (state, action) => {
    let { addr, op } = action.payload;
    let code = [...state.code];
    code[addr] = op;

    return {
      ...state,
      code,
    };
  });

  on(actions.reachedGoal, (state, action) => {
    const { results } = action.payload;
    return {
      ...state,
      paused: true,
      results,
    };
  });

  on(actions.validateStage, (state, action) => {
    return null;
  });
});
