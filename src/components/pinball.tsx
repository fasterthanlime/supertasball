import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";
import Button from "./button";
import styled from "./styles";
import * as planck from "planck-js";
import * as PIXI from "pixi.js";
import "pixi-pause";
import watching, { Watcher } from "./watching";
import { actions } from "../actions";

const width = 16;
const height = 28;

const scale = 20;

const PinballDiv = styled.div`
  margin-right: 15px;
`;

@watching
class Game extends React.PureComponent<Props & DerivedProps> {
  world: any;

  constructor(props, context) {
    super(props, context);
    this.createWorld();
  }

  subscribe(w: Watcher) {
    w.on(actions.reset, async (store, action) => {
      this.left = false;
      this.right = false;
      this.createWorld();
    });

    w.on(actions.execute, async (store, action) => {
      const { op } = action.payload;

      if (op.type == "flip") {
        if (op.name === "left") {
          this.left = op.boolValue;
        } else if (op.name === "right") {
          this.right = op.boolValue;
        }
      }
    });
  }

  ground: planck.Body;
  leftFlipper: planck.Body;
  rightFlipper: planck.Body;
  ball: planck.Body;

  leftFlipperGfx: PIXI.Graphics;
  rightFlipperGfx: PIXI.Graphics;
  ballGfx: PIXI.Graphics;

  createWorld() {
    const pl = planck,
      Vec2 = pl.Vec2;
    const world = new pl.World(Vec2(0, -10));

    // Ground body
    const ground = world.createBody();
    this.ground = ground;
    const chain = pl.Chain(
      [
        Vec2(0.0, 0.0),
        Vec2(8.0, 6.0),
        Vec2(8.0, 16.0),
        Vec2(6.0, 18.0),
        Vec2(8.0, 20.0),
        Vec2(8.0, 28.0),
        Vec2(-8.0, 28.0),
        Vec2(-8.0, 20.0),
        Vec2(-6.0, 18.0),
        Vec2(-8.0, 16.0),
        Vec2(-8.0, 6.0),
      ],
      true,
    );
    ground.createFixture(chain, 0.0);

    // Flippers
    const pLeft = Vec2(-2.0, 3.0);
    const pRight = Vec2(2.0, 3.0);

    const leftFlipper = world.createDynamicBody(pLeft);
    this.leftFlipper = leftFlipper;
    const rightFlipper = world.createDynamicBody(pRight);
    this.rightFlipper = rightFlipper;

    leftFlipper.createFixture(pl.Box(1.75, 0.1), 1.0);
    rightFlipper.createFixture(pl.Box(1.75, 0.1), 1.0);

    const jd: any = {};
    jd.enableMotor = true;
    jd.maxMotorTorque = 1000.0;
    jd.enableLimit = true;
    jd.motorSpeed = 0.0;

    jd.lowerAngle = -30.0 * Math.PI / 180.0;
    jd.upperAngle = 5.0 * Math.PI / 180.0;
    const leftJoint = pl.RevoluteJoint(jd, ground, leftFlipper, pLeft);
    world.createJoint(leftJoint);

    jd.lowerAngle = -5.0 * Math.PI / 180.0;
    jd.upperAngle = 30.0 * Math.PI / 180.0;
    const rightJoint = pl.RevoluteJoint(jd, ground, rightFlipper, pRight);
    world.createJoint(rightJoint);

    // Circle character
    const ball = world.createBody({
      position: Vec2(1.0, 15.0),
      type: "dynamic",
      bullet: true,
    });
    ball.createFixture(pl.Circle(0.2), 1.0);
    this.ball = ball;

    this.leftJoint = leftJoint;
    this.rightJoint = rightJoint;
    this.world = world;
  }

  leftJoint: planck.JointDef;
  rightJoint: planck.JointDef;
  left = false;
  right = false;

  step = () => {
    if (!this.props.paused) {
      this.world.step(0.016);
      this.props.tick({});
    }

    this.rightJoint.setMotorSpeed(this.right ? -20 : 10);
    this.leftJoint.setMotorSpeed(this.left ? 20 : -10);

    sync(this.ball, this.ballGfx);
    sync(this.leftFlipper, this.leftFlipperGfx);
    sync(this.rightFlipper, this.rightFlipperGfx);

    requestAnimationFrame(this.step);
  };

  render() {
    return <PinballDiv innerRef={this.onRef} />;
  }

  componentDidMount() {
    requestAnimationFrame(this.step);
  }

  onRef = (el: HTMLDivElement) => {
    if (!el) {
      return;
    }

    const app = new PIXI.Application({
      width: 10 + width * scale,
      height: 10 + height * scale,
    });
    app.renderer.backgroundColor = 0xffffff;

    app.stage.position.set(5 + width / 2 * scale, 5 + height * scale);

    const container = new PIXI.Container();
    app.stage.addChild(container);
    container.scale.set(scale, -scale);

    // ---------
    container.addChild(drawBody(this.ground));

    this.leftFlipperGfx = drawBody(this.leftFlipper);
    container.addChild(this.leftFlipperGfx);

    this.rightFlipperGfx = drawBody(this.leftFlipper);
    container.addChild(this.rightFlipperGfx);

    // ---------
    this.ballGfx = drawBody(this.ball);
    container.addChild(this.ballGfx);

    // ---------

    el.appendChild(app.view);
    app.start();
  };
}

interface Props {}

const actionCreators = actionCreatorsList("tick");

type DerivedProps = {
  paused: boolean;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({
    paused: rs.simulation.paused,
  }),
});

//

function drawBody(body: planck.Body): PIXI.Graphics {
  const gfx = new PIXI.Graphics();
  gfx.lineStyle(2 / scale, 0x333333, 1.0);

  for (let f = body.getFixtureList(); f; f = f.getNext()) {
    let shape = f.getShape();
    let type = f.getType();
    switch (type) {
      case "circle": {
        gfx.drawCircle(0, 0, shape.m_radius);
        break;
      }
      case "chain":
      case "polygon": {
        const vertices = shape.m_vertices;
        for (let i = 0; i < vertices.length; i++) {
          let v = vertices[i];
          if (i == 0) {
            gfx.moveTo(v.x, v.y);
          } else {
            gfx.lineTo(v.x, v.y);
          }
        }
        gfx.closePath();
        break;
      }
    }
  }

  return gfx;
}

function sync(b: planck.Body, gfx: PIXI.Graphics) {
  const pos = b.getPosition();
  gfx.position.set(pos.x, pos.y);
  gfx.rotation = b.getAngle();
}
