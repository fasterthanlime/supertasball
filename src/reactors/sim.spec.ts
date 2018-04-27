import { describe, it, assert, FakeStore } from "../test";
import { readFileSync } from "fs";
import { cpuStep } from "./sim";
import { SimulationState, Action, SimulationParams } from "../types";

describe("sim", () => {
  describe("nop", () => {
    it("interprets NOP", () => {
      const oldState: Partial<SimulationState> = {
        code: [{ type: "nop" }, { type: "nop" }],
        pc: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, oldState as SimulationState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.pc, 1);
    });

    it("wraps around", () => {
      const oldState: Partial<SimulationState> = {
        code: [{ type: "nop" }, { type: "nop" }],
        pc: 1,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore, oldState as SimulationState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.pc, 0);
    });
  });

  describe("goto", () => {
    it("interprets GOTO", () => {
      const oldState: Partial<SimulationState> = {
        code: [
          { type: "goto", name: "wee" },
          { type: "nop" },
          { type: "nop", label: "wee" },
        ],
        pc: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore as any, oldState as SimulationState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.pc, 2);
    });

    it("ignores invalid target", () => {
      const oldState: Partial<SimulationState> = {
        code: [
          { type: "goto", name: "whoops" },
          { type: "nop" },
          { type: "nop", label: "wee" },
        ],
        pc: 0,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore as any, oldState as SimulationState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.pc, 1);
    });
  });

  describe("freq", () => {
    it("interprets FREQ", () => {
      const oldState: Partial<SimulationState> = {
        code: [{ type: "freq", numberValue: 4 }, { type: "nop" }],
        pc: 0,
        freq: 1,
        params: ({
          freq: 4,
        } as Partial<SimulationParams>) as any,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore as any, oldState as SimulationState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.freq, 4);
    });

    it("ignores too-low frequency", () => {
      const oldState: Partial<SimulationState> = {
        code: [{ type: "freq", numberValue: -1 }, { type: "nop" }],
        pc: 0,
        freq: 1,
        params: ({
          freq: 1,
        } as Partial<SimulationParams>) as any,
      };
      const fakeStore = new FakeStore();
      const newState = cpuStep(fakeStore as any, oldState as SimulationState);
      assert.deepEqual(fakeStore.dispatched, ["execute"]);
      assert.equal(newState.freq, 1);
    });
  });
});
