import { Watcher } from "../watcher";

import logic from "./logic";
import sim from "./sim";

export default function getWatcher(): Watcher {
  const watcher = new Watcher();

  logic(watcher);
  sim(watcher);

  watcher.validate();
  return watcher;
}
