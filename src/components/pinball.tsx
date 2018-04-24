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
import { drawBody } from "./draw";
import { MapName, mapDefs } from "../map-defs";
import { physx } from "../physics-constants";

let bodyIdSeed = 999;
const width = 320;
const height = 560;

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
    this.map = loadMap(this.props.mapName);

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
      physx.step(this.map.world);
      this.map.ticks++;

      for (const j of this.map.rightJoints) {
        physx.setRightEnabled(j, this.right);
      }
      for (const j of this.map.leftJoints) {
        physx.setLeftEnabled(j, this.left);
      }
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
  mapName: MapName;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({
    paused: rs.simulation.paused,
    mapName: rs.simulation.params.mapName,
  }),
});

//

function sync(b: planck.Body, gfx: PIXI.Graphics) {
  const pos = b.getPosition();
  gfx.position.set(pos.x, pos.y);
  gfx.rotation = b.getAngle();
}
