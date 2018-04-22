import { Watcher } from "../components/watching";
import { actions } from "../actions";

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
}
