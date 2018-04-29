import { actions } from "../actions";
import { Watcher } from "../watcher";
import {
  SimulationState,
  MachineState,
  Code,
  SimulationParams,
} from "../types";
import { Store } from "../store";
import { physx } from "../physics-constants";

export default function(w: Watcher) {
  w.on(actions.boot, async (store, action) => {
    const onTick = () => {
      const { simulation } = store.getState();
      if (simulation) {
        const { machineState } = simulation;
        if (machineState && !simulation.paused) {
          tick(store);
        }
      }

      requestAnimationFrame(onTick);
    };

    requestAnimationFrame(onTick);
  });
}

function tick(store: Store) {
  const { machineState, code, params, stepping } = store.getState().simulation;

  const oldState = machineState;
  let state = {
    ...oldState,
    ticks: oldState.ticks + 1,
  };

  let freqTicks = 60 / state.freq;
  let ticksDelta = state.ticks - state.lastUpdateTicks;
  if (ticksDelta >= freqTicks) {
    state = machineStep(code, params, state);
    if (stepping) {
      store.dispatch(actions.setPaused({ paused: true }));
      store.dispatch(actions.setStepping({ stepping: false }));
    }
  }

  // now update flippers
  physx.step(state.course.world);

  for (const j of state.course.leftJoints) {
    physx.setLeftEnabled(j, state.flipperL);
  }
  for (const j of state.course.rightJoints) {
    physx.setRightEnabled(j, state.flipperR);
  }

  store.dispatch(actions.commitMachineState({ state }));
}

export function machineStep(
  code: Code,
  params: SimulationParams,
  oldState: MachineState,
): MachineState {
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
    case "motor": {
      switch (op.name) {
        case "left":
          state.flipperL = op.boolValue;
          break;
        case "right":
          state.flipperR = op.boolValue;
          break;
      }
      break;
    }
  }

  state.lastUpdateTicks = state.ticks;
  state.pc = nextPc % code.length;

  return state;
}
