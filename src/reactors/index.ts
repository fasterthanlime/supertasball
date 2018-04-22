import { Watcher } from "../watcher";

import logic from "./logic";
import sim from "./sim";
import edit from "./edit";

export default function getWatcher(): Watcher {
  const watcher = new Watcher();

  logic(watcher);
  sim(watcher);
  edit(watcher);

  watcher.validate();
  return watcher;
}
