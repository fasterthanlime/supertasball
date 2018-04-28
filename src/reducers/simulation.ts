import reducer from "./reducer";
import {
  SimulationState,
  OpCode,
  SimulationParams,
  MachineState,
} from "../types";
import { actions } from "../actions";
import store from "../store";
import { loadMap } from "../course";
import { mapDefs } from "../map-defs";
const clone = require("clone");

function freshSimulationState(
  params: SimulationParams,
  oldState: SimulationState | null,
): SimulationState {
  let code = oldState ? oldState.code : null;
  if (!code) {
    code = [];
    code.length = params.codeSize;
    for (let i = 0; i < params.codeSize; i++) {
      code[i] = { type: "nop" };
    }
  }

  const machineState: MachineState = {
    pc: 0,
    ticks: 0,
    lastUpdateTicks: 0,
    freq: params.freq,

    course: loadMap(mapDefs[params.mapName]),
    flipperL: false,
    flipperR: false,
  };

  return {
    params: params,
    paused: true,
    stepping: false,
    code,
    results: null,
    dirty: false,
    machineState,

    // N.B: having to check for these is probably a sign
    // they don't belong at that level of the state in the first place.
    savedMachinedState: oldState ? oldState.savedMachinedState : null,
    undoStack: oldState ? oldState.undoStack : [],
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

  on(actions.setStepping, (state, action) => {
    return {
      ...state,
      stepping: action.payload.stepping,
    };
  });

  on(actions.commitMachineState, (state, action) => {
    return {
      ...state,
      machineState: action.payload.state,
    };
  });

  on(actions.exitSimulation, (state, action) => {
    return null;
  });

  on(actions.reset, (state, action) => {
    let newState = freshSimulationState(state.params, state);
    const { play } = action.payload;
    if (play) {
      newState = { ...newState, paused: false };
    }
    return newState;
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
      dirty: true,
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

  on(actions.checkpoint, (state, action) => {
    return {
      ...state,
      undoStack: [...state.undoStack, state.code],
    };
  });

  on(actions.undo, (state, action) => {
    if (state.undoStack.length == 0) {
      return state;
    }

    let code = state.undoStack[state.undoStack.length - 1];
    let undoStack = [...state.undoStack];
    undoStack.length = undoStack.length - 1;

    return {
      ...state,
      code,
      undoStack,
    };
  });

  on(actions.flipper, (state, action) => {
    const { side, pressed } = action.payload;
    let machineState = state.machineState;
    if (side === "left") {
      machineState = {
        ...machineState,
        flipperL: pressed,
      };
    } else if (side === "right") {
      machineState = {
        ...machineState,
        flipperR: pressed,
      };
    }

    return {
      ...state,
      machineState,
    };
  });

  on(actions.loadState, (state, action) => {
    if (state.savedMachinedState) {
      return {
        ...state,
        machineState: clone(state.savedMachinedState),
      };
    }

    return state;
  });

  on(actions.saveState, (state, action) => {
    return {
      ...state,
      savedMachinedState: clone(state.machineState),
    };
  });
});
