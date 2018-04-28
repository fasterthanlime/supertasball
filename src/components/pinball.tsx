import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState } from "../types";
import Button from "./button";
import styled from "./styles";
import * as planck from "planck-js";
import * as PIXI from "pixi.js";
import "pixi-pause";
import { actions } from "../actions";
import { T_Vec2 } from "planck-js";
import { drawBody } from "./draw";
import { MapName, mapDefs } from "../map-defs";
import { physx } from "../physics-constants";
import { Course } from "../course";

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

class Pinball extends React.PureComponent<Props & DerivedProps> {
  constructor(props, context) {
    super(props, context);
  }

  bindings: {
    [key: number]: Binding;
  };

  setupGraphics() {
    this.bindings = [];
    this.container.removeChildren();

    for (let b = this.props.course.world.getBodyList(); b; b = b.getNext()) {
      const gfx = new PIXI.Graphics();
      b.id = bodyIdSeed++;
      drawBody(b, gfx);
      this.container.addChild(gfx);
      this.bindings[b.id] = {
        body: b,
        gfx,
      };
    }

    this.syncAll();
  }

  syncAll() {
    for (const id of Object.keys(this.bindings)) {
      const binding = this.bindings[id];
      if (binding.body.dirty) {
        drawBody(binding.body, binding.gfx);
        binding.body.dirty = false;
      }
      sync(binding.body, binding.gfx);
    }
  }

  render() {
    return <PinballDiv innerRef={this.onRef} />;
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

    // ---------

    el.appendChild(app.view);
    app.start();
  };

  //---------------------------------------------------
  // Lifecycle methods
  //---------------------------------------------------

  componentDidMount() {
    this.setupGraphics();
  }

  componentWillUnmount() {
    if (this.app) {
      this.app.destroy();
      this.app = null;
    }
  }

  componentDidUpdate(prevProps: Pinball["props"], prevState: any) {
    if (prevProps.course != this.props.course) {
      this.setupGraphics();
      return;
    }

    if (prevProps.ticks != this.props.ticks) {
      this.syncAll();
      return;
    }
  }
}

interface Props {}

const actionCreators = actionCreatorsList();

type DerivedProps = {
  paused: boolean;
  mapName: MapName;
  course: Course;
  ticks: number;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Pinball, {
  actionCreators,
  state: (rs: RootState) => ({
    paused: rs.simulation.paused,
    mapName: rs.simulation.params.mapName,
    course: rs.simulation.machineState.course,
    ticks: rs.simulation.machineState.ticks,
  }),
});

//

function sync(b: planck.Body, gfx: PIXI.Graphics) {
  const pos = b.getPosition();
  gfx.position.set(pos.x, pos.y);
  gfx.rotation = b.getAngle();
}
