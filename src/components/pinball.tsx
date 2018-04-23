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
import { parseSVG, makeAbsolute } from "svg-path-parser";
import { T_Vec2 } from "planck-js";

const bearMap = require("../maps/bear.svg");

const width = 320;
const height = 560;

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
    w.on(actions.reset, (store, action) => {
      this.left = false;
      this.right = false;
      this.createWorld();
    });

    w.on(actions.execute, (store, action) => {
      const { op } = action.payload;

      if (op.type == "motor") {
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
    const world = new pl.World(Vec2(0, 160));

    const fixed = world.createBody();

    const doc = new DOMParser().parseFromString(bearMap, "text/xml");

    {
      const paths = doc.querySelectorAll("path");
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const tags = path.querySelector("desc").textContent.split("\n");

        const points = parseSVG(path.attributes["d"].nodeValue);
        makeAbsolute(points);
        if (tags.indexOf("#ground") !== -1) {
          const ground = world.createBody();
          this.ground = ground;
          const vecs: T_Vec2[] = [];
          let i = 0;
          for (let i = 0; i < points.length; i++) {
            let p = points[i];
            vecs.push(Vec2(p.x, p.y));
          }
          const chain = pl.Chain(vecs, true);
          ground.createFixture(chain, 0.0);
        }
      }
    }
    {
      const ellipses = doc.querySelectorAll("ellipse");
      for (let i = 0; i < ellipses.length; i++) {
        const ellipse = ellipses[i];
        const tags = ellipse.querySelector("desc").textContent.split("\n");

        if (tags.indexOf("#ball") !== -1) {
          const position = Vec2(
            +ellipse.attributes["cx"].nodeValue,
            +ellipse.attributes["cy"].nodeValue,
          );
          const radius = +ellipse.attributes["rx"].nodeValue;
          console.log(`doing ball! position = `, position, radius);
          const ball = world.createBody({
            position,
            type: "dynamic",
            bullet: true,
          });
          ball.createFixture(pl.Circle(radius), 1.0);
          this.ball = ball;
        }
      }
    }

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
    const leftJoint = pl.RevoluteJoint(jd, fixed, leftFlipper, pLeft);
    world.createJoint(leftJoint);

    jd.lowerAngle = -5.0 * Math.PI / 180.0;
    jd.upperAngle = 30.0 * Math.PI / 180.0;
    const rightJoint = pl.RevoluteJoint(jd, fixed, rightFlipper, pRight);
    world.createJoint(rightJoint);

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
      width,
      height,
    });
    app.renderer.backgroundColor = 0xffffff;

    app.stage.position.set(0, 0);

    const container = new PIXI.Container();
    app.stage.addChild(container);

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
  let lineWidth = 3;
  let lineColor = 0x333333;

  for (let f = body.getFixtureList(); f; f = f.getNext()) {
    let shape = f.getShape();
    let type = f.getType();
    switch (type) {
      case "circle": {
        // gfx.lineStyle(lineWidth, lineColor, 1.0);
        gfx.beginFill(lineColor, 1.0);
        gfx.drawCircle(0, 0, shape.m_radius);
        gfx.endFill();
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
            gfx.lineStyle(lineWidth, lineColor, 1.0);
            gfx.lineTo(v.x, v.y);
          }
        }
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
