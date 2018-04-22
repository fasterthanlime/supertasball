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

  code[0] = {
    type: "freq",
    numberValue: 32,
    label: "crazy",
  };
  code[1] = {
    type: "flip",
    name: "right",
    boolValue: true,
  };
  code[2] = {
    type: "note",
    name: "0",
    boolValue: true,
    numberValue: 480,
  };
  code[3] = {
    type: "flip",
    name: "right",
    boolValue: false,
  };
  code[4] = {
    type: "note",
    name: "0",
    boolValue: false,
  };
  code[5] = {
    type: "note",
    name: "0",
    boolValue: true,
    numberValue: 580,
  };
  code[6] = {
    type: "flip",
    name: "right",
    boolValue: true,
  };
  code[7] = {
    type: "note",
    name: "0",
    boolValue: false,
  };
  code[8] = {
    type: "flip",
    name: "right",
    boolValue: false,
  };
  code[9] = {
    type: "freq",
    numberValue: 1,
  };
  code[10] = {
    type: "freq",
    numberValue: 32,
  };
  code[11] = {
    type: "goto",
    name: "crazy",
  };

  return {
    params: params,
    paused: true,
    ticks: 0,
    lastUpdateTicks: 0,
    pc: 0,
    stepping: false,
    code,
    freq: params.freq,
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

  on(actions.commitSimulationState, (state, action) => {
    return action.payload.state;
  });

  on(actions.exitSimulation, (state, action) => {
    return null;
  });

  on(actions.reset, (state, action) => {
    return freshSimulationState(state.params);
  });

  on(actions.stepForward, (state, action) => {
    return {
      ...state,
      paused: false,
      stepping: true,
    };
  });
});
