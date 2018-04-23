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
import { T_Vec2 } from "planck-js";
import { Map, loadMap } from "./map";

const bearMap = require("../maps/bear.svg");

let bodyIdSeed = 999;
const width = 320;
const height = 560;

const activeSpeed = 40;
const inactiveSpeed = 20;

const PinballDiv = styled.div`
  margin-right: 15px;
`;

interface Binding {
  body: planck.Body;
  gfx: PIXI.Graphics;
}

@watching
class Game extends React.PureComponent<Props & DerivedProps> {
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

  bindings: {
    [key: number]: Binding;
  };
  map: Map;

  createWorld() {
    this.map = loadMap(bearMap);

    this.bindings = [];
    this.container.removeChildren();

    for (let b = this.map.world.getBodyList(); b; b = b.getNext()) {
      const gfx = new PIXI.Graphics();
      b.id = bodyIdSeed++;
      drawBody(b, gfx);
      this.container.addChild(gfx);
      this.bindings[b.id] = {
        body: b,
        gfx,
      };
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
        this.map.world.step(0.016 / fraction);
      }
    }

    for (const j of this.map.rightJoints) {
      j.setMotorSpeed(this.right ? activeSpeed : -inactiveSpeed);
    }
    for (const j of this.map.leftJoints) {
      j.setMotorSpeed(this.left ? -activeSpeed : inactiveSpeed);
    }

    for (const id of Object.keys(this.bindings)) {
      const binding = this.bindings[id];
      if (binding.body.dirty) {
        drawBody(binding.body, binding.gfx);
        binding.body.dirty = false;
      }
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
    if (this.app) {
      this.app.destroy();
      this.app = null;
    }
  }

  app: PIXI.Application;
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
    this.app = app;
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

function drawBody(body: planck.Body, gfx: PIXI.Graphics) {
  let lineWidth = 1;
  let lineColor = body.strokeColor;

  gfx.clear();

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
