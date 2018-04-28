declare module "clonable-planck-js" {
  // custom addition
  interface Tags {
    type: string;
    [key: string]: string;
  }

  class T_Vec2 {
    x: number;
    y: number;
  }
  function Vec2(x: number, y: number): T_Vec2;

  interface Fixture {
    getType(): FixtureType;
    getShape(): Shape;
    getBody(): Body;

    // for lists
    getNext(): Fixture;
  }

  interface FixtureDef {
    shape: Shape;
    density: number;
    restitution?: number;
    isSensor?: boolean;
    filterCategoryBits?: number;
    filterMaskBits?: number;
    filterGroupIndex?: number;
  }

  class Body {
    createFixture(fixtureDef: FixtureDef): Fixture;
    getFixtureList(): Fixture;
    getPosition(): T_Vec2;
    getAngle(): number;
    setAngle(angle: number);
    getWorldCenter(): T_Vec2;

    setStatic(): void;
    setDynamic(): void;
    setKinematic(): void;

    // for lists
    getNext(): Body;

    // additions
    tags: Tags;

    id?: number;
    dirty: boolean;

    fill?: boolean;
    fillColor?: number;

    stroke?: boolean;
    strokeColor?: number;
  }

  export type BodyType = "dynamic" | "static";

  interface BodyDef {
    position?: T_Vec2;
    type?: BodyType;
    bullet?: boolean;
  }

  class World {
    constructor(v: T_Vec2);
    createBody(opts?: BodyDef): Body;
    createDynamicBody(pos: T_Vec2): Body;
    createJoint(def: Joint);
    getBodyList(): Body;
    on(ev: "pre-solve", f: (contact: Contact, oldManifold: Manifold) => void);
    on(ev: "begin-contact", f: (contact: Contact) => void);
    on(ev: "end-contact", f: (contact: Contact) => void);
    step(dt: number);
  }

  interface Contact {
    getManifold(): Manifold;
    getWorldManifold(): Manifold;
    getFixtureA(): Fixture;
    getFixtureB(): Fixture;
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

  function Chain(vecs: T_Vec2[], loop: boolean): Shape;
  function Polygon(vecs: T_Vec2[]): Shape;
  function Box(width: number, height: number): Shape;
  function Circle(radius: number): Shape;

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
