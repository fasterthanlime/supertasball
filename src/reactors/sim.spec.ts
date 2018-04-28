import { describe, it, assert, FakeStore } from "../test";
import { readFileSync } from "fs";
import { machineStep } from "./sim";
import {
  SimulationState,
  Action,
  SimulationParams,
  MachineState,
  Code,
} from "../types";

const params: SimulationParams = {
  codeSize: 200,
  freq: 60,
  gameMode: "score",
  mapName: "custom",
};

const defaultMachineState: MachineState = {
  pc: 0,
  freq: 1,
  ticks: 0,
  lastUpdateTicks: 0,
  flipperL: false,
  flipperR: false,
  course: null,
};

describe("sim", () => {
  describe("nop", () => {
    it("interprets NOP", () => {
      const code: Code = [{ type: "nop" }, { type: "nop" }];
      const machineState: MachineState = {
        ...defaultMachineState,
      };
      const newState = machineStep(code, params, machineState);
      assert.equal(newState.pc, 1);
    });

    it("wraps around", () => {
      const code: Code = [{ type: "nop" }, { type: "nop" }];
      const machineState: MachineState = {
        ...defaultMachineState,
        pc: 1,
      };
      const newState = machineStep(code, params, machineState);
      assert.equal(newState.pc, 0);
    });
  });

  describe("goto", () => {
    it("interprets GOTO", () => {
      const code: Code = [
        { type: "goto", name: "wee" },
        { type: "nop" },
        { type: "nop", label: "wee" },
      ];
      const machineState: MachineState = {
        ...defaultMachineState,
      };
      const fakeStore = new FakeStore();
      const newState = machineStep(code, params, machineState);
      assert.equal(newState.pc, 2);
    });

    it("ignores invalid target", () => {
      const code: Code = [
        { type: "goto", name: "whoops" },
        { type: "nop" },
        { type: "nop", label: "wee" },
      ];
      const machineState: MachineState = {
        ...defaultMachineState,
      };
      const fakeStore = new FakeStore();
      const newState = machineStep(code, params, machineState);
      assert.equal(newState.pc, 1);
    });
  });

  describe("freq", () => {
    it("interprets FREQ", () => {
      const code: Code = [{ type: "freq", numberValue: 4 }, { type: "nop" }];
      const ourParams = {
        ...params,
        freq: 4,
      };
      const machineState: MachineState = {
        ...defaultMachineState,
      };
      const fakeStore = new FakeStore();
      const newState = machineStep(code, params, machineState);
      assert.equal(newState.freq, 4);
    });

    it("ignores too-low frequency", () => {
      const machineState: MachineState = {
        ...defaultMachineState,
      };
      const code: Code = [{ type: "freq", numberValue: -1 }, { type: "nop" }];
      const fakeStore = new FakeStore();
      const newState = machineStep(code, params, machineState);
      assert.equal(newState.freq, 1);
    });
  });
});
