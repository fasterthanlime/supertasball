import { Watcher } from "../components/watching";
import { actions } from "../actions";
import { OpCode, OpCodeTypes } from "../types";

export default function(w: Watcher) {
  w.on(actions.cellClear, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const rs = store.getState();
    const { code } = rs.simulation;
    const cs = rs.ui.cellSelection;

    for (let i = 0; i < cs.size; i++) {
      store.dispatch(
        actions.commitCell({ addr: cs.start + i, op: { type: "nop" } }),
      );
    }
  });

  w.on(actions.cellDuplicate, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const rs = store.getState();
    const { code } = rs.simulation;
    const cs = rs.ui.cellSelection;

    let toDuplicate: OpCode[] = [];

    for (let i = 0; i < cs.size; i++) {
      toDuplicate.push(code[cs.start + i]);
    }
    for (let j = 0; j < cs.size; j++) {
      let addr = cs.start + cs.size + j;
      let op = toDuplicate[j];
      store.dispatch(actions.commitCell({ addr, op }));
    }
    store.dispatch(
      actions.setCellSelection({ start: cs.start + cs.size, size: cs.size }),
    );
  });

  w.on(actions.cellSetType, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const { type } = action.payload;
    let cs = store.getState().ui.cellSelection;

    if (typeof action.payload.addr !== "undefined") {
      cs = { start: action.payload.addr, size: 1 };
    }

    let model: OpCode = { type: type };
    const def = OpCodeTypes[type];
    if (def.relevantFields.name && def.relevantFields.name.choices) {
      model.name = def.relevantFields.name.choices[0].value;
    }
    if (def.relevantFields.numberValue) {
      model.numberValue = def.relevantFields.numberValue.defaultValue;
    }
    if (def.relevantFields.boolValue) {
      model.boolValue = true;
    }

    for (let i = 0; i < cs.size; i++) {
      store.dispatch(
        actions.commitCell({
          addr: cs.start + i,
          op: { ...model },
        }),
      );
    }
  });

  w.on(actions.cellSetName, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const { code } = store.getState().simulation;
    const { addr, name } = action.payload;
    const op = code[addr];
    store.dispatch(actions.commitCell({ addr, op: { ...op, name } }));
  });

  w.on(actions.cellSetLabel, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const { code } = store.getState().simulation;
    const { addr, label } = action.payload;
    const op = code[addr];
    store.dispatch(actions.commitCell({ addr, op: { ...op, label } }));
  });

  w.on(actions.cellSetNumberValue, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const { code } = store.getState().simulation;
    const { addr, numberValue } = action.payload;
    const op = code[addr];
    store.dispatch(actions.commitCell({ addr, op: { ...op, numberValue } }));
  });

  w.on(actions.cellSetBoolValue, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const { code } = store.getState().simulation;
    const { addr, boolValue } = action.payload;
    const op = code[addr];
    store.dispatch(actions.commitCell({ addr, op: { ...op, boolValue } }));
  });

  w.on(actions.cellYank, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const rs = store.getState();
    const { code } = rs.simulation;
    const cs = rs.ui.cellSelection;
    let ops: OpCode[] = [];
    for (let i = 0; i < cs.size; i++) {
      let addr = i + cs.start;
      let op = code[addr];
      ops.push({ ...op });
    }
    store.dispatch(actions.clipboardPut({ ops }));

    const nop: OpCode = { type: "nop" };
    for (let i = cs.start; i < code.length; i++) {
      let addr = i;
      let op = code[i + cs.size];
      store.dispatch(actions.commitCell({ addr, op: { ...(op || nop) } }));
    }
  });

  w.on(actions.cellCut, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const rs = store.getState();
    const { code } = rs.simulation;
    const cs = rs.ui.cellSelection;
    let ops: OpCode[] = [];
    for (let i = 0; i < cs.size; i++) {
      let addr = i + cs.start;
      let op = code[addr];
      ops.push({ ...op });
      store.dispatch(actions.commitCell({ addr, op: { type: "nop" } }));
    }
    store.dispatch(actions.clipboardPut({ ops }));
  });

  w.on(actions.cellCopy, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const rs = store.getState();
    const { code } = rs.simulation;
    const cs = rs.ui.cellSelection;
    let ops: OpCode[] = [];
    for (let i = 0; i < cs.size; i++) {
      let addr = i + cs.start;
      let op = code[addr];
      ops.push({ ...op });
    }
    store.dispatch(actions.clipboardPut({ ops }));
  });

  w.on(actions.cellPaste, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const rs = store.getState();
    const { code } = rs.simulation;
    const cs = rs.ui.cellSelection;
    const cb = rs.ui.clipboard;

    for (let i = 0; i < cb.ops.length; i++) {
      let addr = cs.start + i;
      let op = cb.ops[i];
      store.dispatch(actions.commitCell({ addr, op: { ...op } }));
    }
    store.dispatch(
      actions.setCellSelection({ start: cs.start + cb.ops.length, size: 1 }),
    );
  });

  w.on(actions.cellPasteInsert, (store, action) => {
    store.dispatch(actions.checkpoint({}));
    const rs = store.getState();
    const { code } = rs.simulation;
    const cs = rs.ui.cellSelection;
    const cb = rs.ui.clipboard;

    const nop: OpCode = { type: "nop" };
    for (let i = cs.start + cb.ops.length; i < code.length; i++) {
      let addr = i;
      let op = code[i - cb.ops.length];
      store.dispatch(actions.commitCell({ addr, op: { ...(op || nop) } }));
    }
    for (let i = 0; i < cb.ops.length; i++) {
      let addr = cs.start + i;
      let op = cb.ops[i];
      store.dispatch(actions.commitCell({ addr, op: { ...op } }));
    }
    store.dispatch(
      actions.setCellSelection({ start: cs.start + cb.ops.length, size: 1 }),
    );
  });
}
