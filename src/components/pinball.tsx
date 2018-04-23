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

const activeSpeed = 40;
const inactiveSpeed = 20;

const bigAngle = 20;
const lowAngle = 25;

const gravityY = 150;

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
        const desc = path.querySelector("desc");
        const tags: string[] = desc ? desc.textContent.split("\n") : [];
        let filterGroupIndex = -1;

        const points = parseSVG(path.attributes["d"].nodeValue);
        makeAbsolute(points);

        let offsetX = 0;
        let offsetY = 0;

        let isStatic = true;
        if (tags.indexOf("#flipper") !== -1) {
          isStatic = false;
        }

        let jd: planck.RevoluteJointOpts;
        let jointList: planck.Joint[];
        let body: planck.Body;
        let pos = Vec2(0, 0);

        if (tags.indexOf("#flipper") !== -1) {
          let left = tags.indexOf("#left") !== -1;
          let right = !left;

          let totalX = 0.0;
          let totalY = 0.0;
          let minX = Infinity;
          let maxX = -Infinity;
          let minY = Infinity;
          let maxY = -Infinity;
          for (const p of points) {
            if (p.x < minX) {
              minX = p.x;
            }
            if (p.x > maxX) {
              maxX = p.x;
            }
            if (p.y < minY) {
              minY = p.y;
            }
            if (p.y > maxY) {
              maxY = p.y;
            }
            totalX += p.x;
            totalY += p.y;
          }

          totalX /= points.length;
          totalY /= points.length;
          pos.x = totalX;
          pos.y = totalY;

          let width = maxX - minX;
          let height = maxY - minY;
          if (left) {
            pos.x -= width * 0.4;
          } else {
            pos.x += width * 0.4;
          }

          offsetX = -pos.x;
          offsetY = -pos.y;
          body = world.createBody({
            position: pos,
            type: "dynamic",
            bullet: true,
          });

          jd = {
            enableMotor: true,
            maxMotorTorque: 2000000.0,
            enableLimit: true,
            motorSpeed: 0.0,
          };
          let dir: planck.T_Vec2;
          if (tags.indexOf("#left") !== -1) {
            jd.lowerAngle = toRadians(-bigAngle);
            jd.upperAngle = toRadians(lowAngle);
            jointList = this.leftJoints;
          } else if (tags.indexOf("#right") !== -1) {
            jd.lowerAngle = toRadians(-lowAngle);
            jd.upperAngle = toRadians(bigAngle);
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

        const shapeDef: planck.ShapeDef = {
          density: isStatic ? 0.0 : 0.1,
          filterGroupIndex,
        };
        let fixtureDef: planck.FixtureDef;
        if (isStatic) {
          fixtureDef = pl.Chain(vecs, false);
        } else {
          fixtureDef = pl.Polygon(vecs);
        }
        body.createFixture(fixtureDef, shapeDef);

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
        let density = 0.02;
        let type: planck.BodyType = "dynamic";
        let bullet = true;
        let isSensor = false;

        if (tags.indexOf("#collect") !== -1) {
          type = "static";
          density = 0.0;
          bullet = false;
          isSensor = true;
        }

        const body = world.createBody({
          position,
          type,
          bullet,
        });
        body.tags = tags;
        const ddef: planck.DetailedFixtureDef = {
          shape: pl.Circle(radius),
        };
        if (isSensor) {
          ddef.isSensor = true;
        }
        body.createFixture(ddef, {
          density: 0.02,
        });
      }
    }

    world.on("begin-contact", function(contact) {
      let bodyA = contact.getFixtureA().getBody();
      let bodyB = contact.getFixtureB().getBody();
      console.log(
        JSON.stringify(bodyA.tags),
        `has contact with`,
        JSON.stringify(bodyB.tags),
      );
    });

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
      let fraction = 4;
      for (let i = 0; i < fraction; i++) {
        this.world.step(0.016 / fraction);
      }
    }

    for (const j of this.rightJoints) {
      j.setMotorSpeed(this.right ? activeSpeed : -inactiveSpeed);
    }
    for (const j of this.leftJoints) {
      j.setMotorSpeed(this.left ? -activeSpeed : inactiveSpeed);
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
        if (body.fill) {
          gfx.beginFill(body.fillColor, 1.0);
        } else {
          gfx.lineStyle(lineWidth, lineColor, 1.0);
        }
        gfx.drawCircle(0, 0, shape.m_radius);
        if (body.fill) {
          gfx.endFill();
        }
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
        if (type === "polygon") {
          gfx.closePath();
        }
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
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180.0;
}
