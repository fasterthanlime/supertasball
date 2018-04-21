import reducer from "./index";
import { ResourcesState } from "../types";

const initialState: ResourcesState = {
  money: 0,
  codeSize: 20,
  freq: 4,
};

export default reducer<ResourcesState>(initialState, on => {
  // muffin
});
