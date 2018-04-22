import { Watcher } from "../components/watching";
import { actions } from "../actions";
import { OpCode } from "../types";

export default function(w: Watcher) {
  w.on(actions.cellClear, (store, action) => {
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
    const { type } = action.payload;
    const cs = store.getState().ui.cellSelection;
    for (let i = 0; i < cs.size; i++) {
      store.dispatch(
        actions.commitCell({
          addr: cs.start + i,
          op: { type: type },
        }),
      );
    }
  });
}
