import { Watcher } from "../watcher";

import logic from "./logic";

export default function getWatcher(): Watcher {
  const watcher = new Watcher();

  logic(watcher);
  watcher.validate();
  return watcher;
}
