import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const { assert } = chai;
import "mocha";
import { Action } from "./types";

require.extensions[".xm"] = function(module, filename) {
  return null;
};

const _describe = describe;
const _it = it;
export { _describe as describe, _it as it, assert };

export class FakeStore {
  dispatched: string[] = [];
  watcher: any;

  dispatch(action: Action<any>) {
    this.dispatched.push(action.type);
  }

  getState(): any {
    return null;
  }
}
