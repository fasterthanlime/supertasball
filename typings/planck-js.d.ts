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

  interface DetailedFixtureDef {
    shape: FixtureDef;
    isSensor?: boolean;
  }

  class Body {
    createFixture(
      def: FixtureDef | DetailedFixtureDef,
      densityOrShapeDef: number | ShapeDef,
    ): Fixture;
    getFixtureList(): Fixture;
    getPosition(): T_Vec2;
    getAngle(): number;
    setAngle(): number;
    getWorldCenter(): T_Vec2;

    // for lists
    getNext(): Body;

    // additions
    tags: string[];

    fill?: boolean;
    fillColor?: number;
  }

  export type BodyType = "dynamic" | "static";

  interface CreateBodyOpts {
    position?: T_Vec2;
    type?: BodyType;
    bullet?: boolean;
  }

  class World {
    constructor(v: T_Vec2);
    createBody(opts?: CreateBodyOpts): Body;
    createDynamicBody(pos: T_Vec2): Body;
    createJoint(def: Joint);
    getBodyList(): Body;
    on(ev: "pre-solve", f: (contact: Contact, oldManifold: Manifold) => void);
    on(ev: "begin-contact", f: (contact: Contact) => void);
    on(ev: "end-contact", f: (contact: Contact) => void);
  }

  interface Contact {
    getManifold(): Manifold;
    getWorldManifold(): Manifold;
    getFixtureA(): FixtureDef;
    getFixtureB(): FixtureDef;
  }

  interface Manifold {
    pointCount: number;
  }

  type FixtureType = "circle" | "edge" | "polygon" | "chain";

  interface Shape {
    m_p: T_Vec2;

    // circle
    m_radius: number;

    // chain & polygon
    m_vertices: T_Vec2[];
  }

  interface FixtureDef {
    getBody(): Body;
  }

  interface ShapeDef {
    density: number;
    filterCategoryBits?: number;
    filterMaskBits?: number;
    filterGroupIndex?: number;
  }

  function Chain(vecs: T_Vec2[], loop: boolean): FixtureDef;
  function Polygon(vecs: T_Vec2[]): FixtureDef;
  function Box(width: number, height: number): FixtureDef;
  function Circle(radius: number): FixtureDef;

  interface Joint {
    setMotorSpeed(speed: number);
    getMotorSpeed(): number;
    getReactionForce(): T_Vec2;
    getReactionTorque(): number;
  }

  interface RevoluteJointOpts {
    enableMotor?: boolean;
    maxMotorTorque?: number;
    enableLimit?: boolean;
    motorSpeed?: number;

    lowerAngle?: number;
    upperAngle?: number;
  }

  function RevoluteJoint(
    opts: RevoluteJointOpts,
    a: Body,
    b: Body,
    vec: T_Vec2,
  ): Joint;
}
