import { describe, it, assert, FakeStore } from "../test";
import { readFileSync } from "fs";
import { cpuStep } from "./sim";
import {
  SimulationState,
  Action,
  SimulationParams,
  CPUState,
  Code,
} from "../types";

const params: SimulationParams = {
  codeSize: 200,
  freq: 60,
  gameMode: "score",
  mapName: "custom",
};

describe("sim", () => {
  describe("nop", () => {
    it("interprets NOP", () => {
      const code: Code = [{ type: "nop" }, { type: "nop" }];
      const cpuState: CPUState = {
        pc: 0,
        freq: 1,
        lastUpdateTicks: 0,
        ticks: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, code, params, cpuState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.pc, 1);
    });

    it("wraps around", () => {
      const code: Code = [{ type: "nop" }, { type: "nop" }];
      const cpuState: CPUState = {
        pc: 1,
        freq: 1,
        lastUpdateTicks: 0,
        ticks: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, code, params, cpuState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
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
      const cpuState: CPUState = {
        pc: 0,
        freq: 1,
        lastUpdateTicks: 0,
        ticks: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, code, params, cpuState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.pc, 2);
    });

    it("ignores invalid target", () => {
      const code: Code = [
        { type: "goto", name: "whoops" },
        { type: "nop" },
        { type: "nop", label: "wee" },
      ];
      const cpuState: CPUState = {
        pc: 0,
        freq: 1,
        lastUpdateTicks: 0,
        ticks: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, code, params, cpuState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
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
      const cpuState: CPUState = {
        pc: 0,
        freq: 1,
        lastUpdateTicks: 0,
        ticks: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, code, params, cpuState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.freq, 4);
    });

    it("ignores too-low frequency", () => {
      const cpuState: CPUState = {
        pc: 0,
        freq: 1,
        lastUpdateTicks: 0,
        ticks: 0,
      };
      const code: Code = [{ type: "freq", numberValue: -1 }, { type: "nop" }];
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, code, params, cpuState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.freq, 1);
    });
  });
});
