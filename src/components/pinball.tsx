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
const tinycolor = require("tinycolor2");

const bearMap = require("../maps/bear.svg");

const width = 320;
const height = 560;

const gravityY = 160;

const PinballDiv = styled.div`
  margin-right: 15px;
`;

interface Binding {
  body: planck.Body;
  gfx: PIXI.Graphics;
}

@watching
class Game extends React.PureComponent<Props & DerivedProps> {
  world: any;
  running: boolean;

  constructor(props, context) {
    super(props, context);
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

  bindings: Binding[];
  leftJoints: planck.Joint[];
  rightJoints: planck.Joint[];

  createWorld() {
    this.bindings = [];
    this.leftJoints = [];
    this.rightJoints = [];

    const pl = planck,
      Vec2 = pl.Vec2;
    const world = new pl.World(Vec2(0, gravityY));
    this.world = world;

    const fixed = world.createBody();
    fixed.createFixture(pl.Box(0, 0), 0.0);

    const doc = new DOMParser().parseFromString(bearMap, "text/xml");

    {
      const paths = doc.querySelectorAll("path");
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const tags = path.querySelector("desc").textContent.split("\n");

        const points = parseSVG(path.attributes["d"].nodeValue);
        makeAbsolute(points);

        let offsetX = 0;
        let offsetY = 0;

        let isStatic = tags.indexOf("#ground") !== -1;

        let jd: planck.RevoluteJointOpts;
        let jointList: planck.Joint[];
        let body: planck.Body;
        let pos = Vec2(0, 0);

        if (tags.indexOf("#flipper") !== -1) {
          let totalX = 0.0,
            totalY = 0.0;
          for (const p of points) {
            totalX += p.x;
            totalY += p.y;
          }
          totalX /= points.length;
          totalY /= points.length;
          pos.x = totalX;
          pos.y = totalY;
          offsetX = -totalX;
          offsetY = -totalY;
          body = world.createDynamicBody(pos);

          jd = {
            enableMotor: true,
            maxMotorTorque: 10000000.0,
            enableLimit: true,
            motorSpeed: 0.0,
          };
          let dir: planck.T_Vec2;
          if (tags.indexOf("#left") !== -1) {
            jd.lowerAngle = toRadians(-30);
            jd.upperAngle = toRadians(5);
            jointList = this.leftJoints;
          } else if (tags.indexOf("#right") !== -1) {
            jd.lowerAngle = toRadians(-5);
            jd.upperAngle = toRadians(30);
            jointList = this.rightJoints;
          } else {
            throw new Error(
              `${
                path.id
              } has #flipper but not #left or #right. full tags: ${JSON.stringify(
                tags,
              )}`,
            );
          }
        } else {
          body = world.createBody();
        }
        body.tags = tags;
        if (path.style.fill != "none") {
          body.fill = true;
          body.fillColor = parseInt(tinycolor(path.style.fill).toHex(), 16);
        }

        const vecs: T_Vec2[] = [];
        for (const p of points) {
          vecs.push(Vec2(p.x + offsetX, p.y + offsetY));
        }
        {
          const p = points[0];
          vecs.push(Vec2(p.x + offsetX, p.y + offsetY));
        }
        console.log(`vecs = `, vecs);

        if (isStatic) {
          const chain = pl.Chain(vecs, false);
          body.createFixture(chain, 0.0);
        } else {
          body.createFixture(pl.Polygon(vecs), 1.0);
        }

        if (jd) {
          const joint = pl.RevoluteJoint(jd, fixed, body, pos);
          world.createJoint(joint);
          jointList.push(joint);
        }
      }
    }
    {
      const ellipses = doc.querySelectorAll("ellipse");
      for (let i = 0; i < ellipses.length; i++) {
        const ellipse = ellipses[i];
        const tags = ellipse.querySelector("desc").textContent.split("\n");

        const position = Vec2(
          +ellipse.attributes["cx"].nodeValue,
          +ellipse.attributes["cy"].nodeValue,
        );
        const radius = +ellipse.attributes["rx"].nodeValue;
        const body = world.createBody({
          position,
          type: "dynamic",
          bullet: true,
        });
        body.tags = tags;
        body.createFixture(pl.Circle(radius), 1.0);
      }
    }

    // now create graphics
    this.createGraphics();
  }

  createGraphics() {
    this.bindings = [];
    this.container.removeChildren();

    for (let b = this.world.getBodyList(); b; b = b.getNext()) {
      const gfx = drawBody(b);
      this.container.addChild(gfx);
      this.bindings.push({
        body: b,
        gfx,
      });
    }
  }

  left = false;
  right = false;

  step = () => {
    if (!this.running) {
      return;
    }

    if (!this.props.paused) {
      this.props.tick({});
      this.world.step(0.016);
    }

    for (const j of this.rightJoints) {
      j.setMotorSpeed(this.right ? -20 : 10);
      // console.log(
      //   `set speed to: `,
      //   j.getMotorSpeed(),
      //   j.getReactionForce(),
      //   j.getReactionTorque(),
      // );
    }
    for (const j of this.leftJoints) {
      j.setMotorSpeed(this.left ? 20 : -10);
    }

    for (const binding of this.bindings) {
      sync(binding.body, binding.gfx);
    }

    requestAnimationFrame(this.step);
  };

  render() {
    return <PinballDiv innerRef={this.onRef} />;
  }

  componentDidMount() {
    this.running = true;
    requestAnimationFrame(this.step);
  }

  componentWillUnmount() {
    this.running = false;
  }

  container: PIXI.Container;
  onRef = (el: HTMLDivElement) => {
    if (!el) {
      return;
    }

    const app = new PIXI.Application({
      width,
      height,
      antialias: true,
    });
    app.renderer.backgroundColor = 0xffffff;

    app.stage.position.set(0, 0);

    const container = new PIXI.Container();
    this.container = container;
    app.stage.addChild(container);

    this.createWorld();

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
  let lineWidth = 1;
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
        if (body.fill) {
          gfx.beginFill(body.fillColor, 1.0);
        }
        for (let i = 0; i < vertices.length; i++) {
          let v = vertices[i];
          if (i == 0) {
            gfx.moveTo(v.x, v.y);
          } else {
            if (!body.fill) {
              gfx.lineStyle(lineWidth, lineColor, 1.0);
            }
            gfx.lineTo(v.x, v.y);
          }
        }
        gfx.closePath();
        if (body.fill) {
          gfx.endFill();
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
  // if (b.tags && b.tags.indexOf("#flipper") !== -1) {
  //   console.log("flipper angle = ", b.getAngle());
  // }
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180.0;
}
