declare module "planck-js" {
  class T_Vec2 {
    x: number;
    y: number;
  }
  function Vec2(x: number, y: number): T_Vec2;

  interface Fixture {
    getType(): FixtureType;
    getShape(): Shape;

    // for lists
    getNext(): Fixture;
  }

  class Body {
    createFixture(def: FixtureDef, density: number): Fixture;
    getFixtureList(): Fixture;
    getPosition(): T_Vec2;
    getAngle(): number;

    // for lists
    getNext(): Body;

    // additions
    tags: string[];
  }

  interface CreateBodyOpts {
    position?: T_Vec2;
    type?: "dynamic";
    bullet?: boolean;
  }

  class World {
    constructor(v: T_Vec2);
    createBody(opts?: CreateBodyOpts): Body;
    createDynamicBody(pos: T_Vec2): Body;
    createJoint(def: JointDef);
    getBodyList(): Body;
  }

  type FixtureType = "circle" | "edge" | "polygon" | "chain";

  interface Shape {
    m_p: T_Vec2;

    // circle
    m_radius: number;

    // chain & polygon
    m_vertices: T_Vec2[];
  }

  interface FixtureDef {}

  function Chain(vecs: T_Vec2[], loop: boolean): FixtureDef;
  function Box(width: number, height: number): FixtureDef;
  function Circle(radius: number): FixtureDef;

  interface JointDef {
    setMotorSpeed(speed: number);
  }

  interface RevoluteJointOpts {
    enableMotor?: boolean;
    maxMotorTorque?: number;
    enableLimit?: boolean;
    motorSpeed?: number;

    lowerAngle?: number;
    higherAngle?: number;
  }

  function RevoluteJoint(
    opts: RevoluteJointOpts,
    a: Body,
    b: Body,
    vec: T_Vec2,
  ): JointDef;
}
