import {
  ActionCreator,
  Dispatch,
  Action,
  Page,
  OpCode,
  SimulationParams,
  Activity,
  SimulationState,
  OpCodeType,
  Results,
} from "./types";
import { MapName } from "./map-defs";
import { UnlockName } from "./unlocks";
import { Expense } from "./expenses";

// actions

export const actions = wireActions({
  setPage: action<{ page: Page }>(),

  floaty: action<{ clientX: number; clientY: number; text: string }>(),
  floatyKill: action<{ id: string }>(),

  setShowCode: action<{ showCode: boolean }>(),

  setCellSelection: action<{ start: number; size: number }>(),
  commitCell: action<{ addr: number; op: OpCode }>(),

  clipboardPut: action<{ ops: OpCode[] }>(),

  cellYank: action<{}>(),
  cellClear: action<{}>(),
  cellCut: action<{}>(),
  cellCopy: action<{}>(),
  cellPaste: action<{}>(),
  cellPasteInsert: action<{}>(),
  cellDuplicate: action<{}>(),
  cellSetType: action<{ addr?: number; type: OpCodeType }>(),
  cellSetName: action<{ addr?: number; name: string }>(),
  cellSetLabel: action<{ addr?: number; label: string }>(),
  cellSetNumberValue: action<{ addr?: number; numberValue: number }>(),

  playPinball: action<{}>(),
  cancelPlayingPinball: action<{}>(),
  startPlayingPinball: action<{ mapName: MapName }>(),
  moneyDelta: action<{ delta: number }>(),
  doExpense: action<{ expense: Expense; clientX: number; clientY: number }>(),
  doActivity: action<{
    activity: Activity;
    clientX: number;
    clientY: number;
  }>(),

  newSimulation: action<{ params: SimulationParams }>(),

  reachedGoal: action<{ results: Results }>(),
  validateStage: action<{ results: Results }>(),

  setPaused: action<{ paused: boolean }>(),
  tick: action<{}>(),
  reset: action<{}>(),
  stepForward: action<{}>(),
  execute: action<{ op: OpCode }>(),
  commitSimulationState: action<{ state: SimulationState }>(),
  exitSimulation: action<{}>(),

  unlock: action<{ unlockName: UnlockName }>(),
});

// utils

function action<PayloadType>(): ActionCreator<PayloadType> {
  const ret = (type: string) => (payload: PayloadType): Action<PayloadType> => {
    return {
      type,
      payload,
    };
  };
  // bending typing rules a bit, forgive me
  return ret as any;
}

export function dispatcher<T, U>(
  dispatch: Dispatch,
  actionCreator: (payload: T) => Action<U>,
) {
  return (payload: T) => {
    const action = actionCreator(payload);
    dispatch(action);
    return action;
  };
}

interface IMirrorInput {
  [key: string]: ActionCreator<any>;
}

type IMirrorOutput<T> = { [key in keyof T]: T[key] };

function wireActions<T extends IMirrorInput>(input: T): IMirrorOutput<T> {
  const res: IMirrorOutput<T> = {} as any;
  for (const k of Object.keys(input)) {
    res[k] = input[k](k) as any;
  }
  return res;
}
