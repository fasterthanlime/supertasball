import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";
import Button from "./button";
import styled from "./styles";
import * as planck from "planck-js";
import * as PIXI from "pixi.js";

const width = 16;
const height = 28;

const scale = 20;

const PinballDiv = styled.div`
  margin-right: 15px;
`;

class Game extends React.PureComponent<Props & DerivedProps> {
  world: any;

  constructor(props, context) {
    super(props, context);
    this.createWorld();
  }

  chain: planck.Fixture;

  createWorld() {
    const pl = planck,
      Vec2 = pl.Vec2;
    const world = new pl.World(Vec2(0, -10));

    // Ground body
    const ground = world.createBody();
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
    this.chain = ground.createFixture(chain, 0.0);

    // Flippers
    const pLeft = Vec2(-2.0, 0.0);
    const pRight = Vec2(2.0, 0.0);

    const leftFlipper = world.createDynamicBody(pLeft);
    const rightFlipper = world.createDynamicBody(pRight);

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

  ball: planck.Body;
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
    this.leftJoint.setMotorSpeed(this.left ? -20 : 10);

    const ballPos = this.ball.getPosition();
    this.ballGfx.position.set(ballPos.x, ballPos.y);

    requestAnimationFrame(this.step);
  };

  render() {
    return <PinballDiv innerRef={this.onRef} />;
  }

  componentDidMount() {
    requestAnimationFrame(this.step);
  }

  ballGfx: PIXI.Graphics;
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

    const chainGfx = new PIXI.Graphics();
    chainGfx.lineStyle(2 / scale, 0x888888, 1.0);
    const vertices = this.chain.getShape().m_vertices;
    for (let i = 0; i < vertices.length; i++) {
      let v = vertices[i];
      if (i == 0) {
        chainGfx.moveTo(v.x, v.y);
      } else {
        chainGfx.lineTo(v.x, v.y);
      }
    }
    container.addChild(chainGfx);

    const gfx = new PIXI.Graphics();
    gfx.lineStyle(2 / scale, 0x333333, 1.0);
    gfx.drawCircle(0, 0, 0.2);
    gfx.endFill();
    container.addChild(gfx);
    this.ballGfx = gfx;

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
    paused: rs.paused,
  }),
});
