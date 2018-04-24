import { Joint, World } from "planck-js";

export const physx = {
  activeSpeed: 40,
  inactiveSpeed: 20,

  fraction: 8,

  step(world: World) {
    for (let i = 0; i < physx.fraction; i++) {
      world.step(0.016 / physx.fraction);
    }
  },

  setRightEnabled(j: Joint, enabled: boolean) {
    j.setMotorSpeed(enabled ? physx.activeSpeed : -physx.inactiveSpeed);
  },

  setLeftEnabled(j: Joint, enabled: boolean) {
    j.setMotorSpeed(enabled ? -physx.activeSpeed : physx.inactiveSpeed);
  },
};
