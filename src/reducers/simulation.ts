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

  code[1] = {
    type: "writeFlipper",
    name: "right",
    boolValue: true,
  };
  code[3] = {
    type: "writeFlipper",
    name: "right",
    boolValue: false,
  };
  code[6] = {
    type: "writeFlipper",
    name: "right",
    boolValue: true,
  };
  code[8] = {
    type: "writeFlipper",
    name: "right",
    boolValue: false,
  };
  code[10] = {
    type: "writeFlipper",
    name: "left",
    boolValue: true,
  };
  code[0xc] = {
    type: "writeFlipper",
    name: "right",
    boolValue: true,
  };
  code[0xe] = {
    type: "writeFlipper",
    name: "left",
    boolValue: false,
  };
  code[0x13] = {
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
    stepping: false,
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
