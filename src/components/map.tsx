import {
  Joint,
  World,
  Vec2,
  Box,
  Body,
  RevoluteJointOpts,
  T_Vec2,
  Circle,
  FixtureDef,
  Chain,
  Polygon,
  RevoluteJoint,
  BodyType,
  Tags,
  BodyDef,
} from "planck-js";
const tinycolor = require("tinycolor2");
import { parseSVG, makeAbsolute } from "svg-path-parser";
import store from "../store";
import { actions } from "../actions";
import { mapDefs, MapName } from "../map-defs";
import { physx } from "../physics-constants";

const gravityY = 150;
const bigAngle = 20;
const lowAngle = 25;

export interface Group {
  comboPoints: number;
  singlePoints: number;
  total: number;
  hit: number;
}

export interface Groups {
  [key: string]: Group;
}

export interface Map {
  leftJoints: Joint[];
  rightJoints: Joint[];
  world: World;
  ticks: number;
  groups: Groups;
}

export function loadMap(mapName: MapName): Map {
  const mapDef = mapDefs[mapName];

  const m: Map = {
    leftJoints: [],
    rightJoints: [],
    world: new World(Vec2(0, gravityY)),
    ticks: 0,
    groups: {},
  };

  const fixed = m.world.createBody();
  fixed.createFixture({
    shape: Box(0, 0),
    density: 0.0,
  });

  const doc = new DOMParser().parseFromString(mapDef.svg, "text/xml");

  let balls: Body[] = [];

  {
    const paths = doc.querySelectorAll("path");
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const tags = parseTags(path);
      let filterGroupIndex = -1;

      const points = parseSVG(path.attributes["d"].nodeValue);
      makeAbsolute(points);

      let offsetX = 0;
      let offsetY = 0;

      const def: FixtureDef = {
        density: 0.1,
        shape: null,
        filterGroupIndex: -1,
      };

      if (tags.type == "goal") {
        def.isSensor = true;
      }

      if (tags.type == "bumper") {
        def.restitution = 1.0;
      }

      let jd: RevoluteJointOpts;
      let jointList: Joint[];
      let body: Body;
      let pos = Vec2(0, 0);

      if (tags.type == "flipper") {
        let left = tags.side === "left";
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
          pos.x -= width * 0.3169;
        } else {
          pos.x += width * 0.3169;
        }

        offsetX = -pos.x;
        offsetY = -pos.y;
        body = m.world.createBody({
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
        let dir: T_Vec2;
        if (tags.side === "left") {
          jd.lowerAngle = toRadians(-bigAngle);
          jd.upperAngle = toRadians(lowAngle);
          jointList = m.leftJoints;
        } else if (tags.side === "right") {
          jd.lowerAngle = toRadians(-lowAngle);
          jd.upperAngle = toRadians(bigAngle);
          jointList = m.rightJoints;
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
        body = m.world.createBody();
      }
      body.tags = tags;
      parseStyle(path, body);

      const vecs: T_Vec2[] = [];
      for (const p of points) {
        vecs.push(Vec2(p.x + offsetX, p.y + offsetY));
      }

      if (tags.type === "flipper" || tags.type === "goal") {
        def.shape = Polygon(vecs);
      } else {
        def.shape = Chain(vecs, false);
        def.density = 0.0;
      }
      body.createFixture(def);

      if (jd) {
        const joint = RevoluteJoint(jd, fixed, body, pos);
        m.world.createJoint(joint);
        jointList.push(joint);
      }
    }
  }
  {
    const ellipses = doc.querySelectorAll("ellipse, circle");
    for (let i = 0; i < ellipses.length; i++) {
      const ellipse = ellipses[i] as SVGElement;
      const tags = parseTags(ellipse);

      const position = Vec2(
        +ellipse.attributes["cx"].nodeValue,
        +ellipse.attributes["cy"].nodeValue,
      );
      const radius = +(ellipse.attributes["r"] || ellipse.attributes["rx"])
        .nodeValue;

      const bdef: BodyDef = {
        type: "dynamic",
      };

      const def: FixtureDef = {
        shape: null,
        density: 0.02,
      };

      let type: BodyType = "dynamic";
      let bullet = true;

      if (tags.type === "collect") {
        type = "static";
        def.density = 0.0;
        def.isSensor = true;
        bdef.bullet = false;

        if (!tags.group) {
          console.error("collectible without group: ", ellipse);
          throw new Error("collectible without group");
        }
        let g: Group = m.groups[tags.group];
        if (!g) {
          g = {
            hit: 0,
            total: 0,
            singlePoints: 10,
            comboPoints: 50,
          };
          m.groups[tags.group] = g;
        }

        if (tags.singlePoints) {
          g.singlePoints = parseInt(tags.singlePoints, 10);
          g.comboPoints = parseInt(tags.comboPoints, 10);
        }
        g.total++;
      } else if (tags.type === "bumper") {
        type = "static";
        def.density = 0.0;
        def.restitution = 1;
        def.filterGroupIndex = -1;
      }

      const body = m.world.createBody({
        position,
        type,
        bullet,
      });
      body.tags = tags;

      if (body.tags.type === "ball") {
        balls.push(body);
      }

      parseStyle(ellipse, body);
      def.shape = Circle(radius);
      body.createFixture(def);
    }
  }

  // stabilize flippers
  for (const j of m.rightJoints) {
    physx.setRightEnabled(j, false);
  }
  for (const j of m.leftJoints) {
    physx.setLeftEnabled(j, false);
  }

  {
    for (let ball of balls) {
      ball.setStatic();
    }

    for (let j = 0; j < 60; j++) {
      physx.step(m.world);
    }

    for (let ball of balls) {
      ball.setDynamic();
    }
  }

  m.world.on("begin-contact", contact => {
    let bodyA = contact.getFixtureA().getBody();
    let bodyB = contact.getFixtureB().getBody();

    if (bodyB.tags && bodyB.tags.type === "ball") {
      [bodyA, bodyB] = [bodyB, bodyA];
    }

    let btype = bodyB.tags && bodyB.tags.type;
    switch (btype) {
      case "collect": {
        if (!bodyB.fill) {
          bodyB.fill = true;
          bodyB.fillColor = bodyB.strokeColor;
          bodyB.dirty = true;

          const g = m.groups[bodyB.tags.group];
          if (g) {
            g.hit++;
          }
        }
        break;
      }
      case "goal": {
        let score = 0;
        let time = m.ticks * 1 / 60;
        let timeScorePenalty = Math.floor(time * 0.5);
        score -= timeScorePenalty;

        for (const k of Object.keys(m.groups)) {
          const g = m.groups[k];
          for (let i = 0; i < g.hit; i++) {
            score += g.singlePoints;
          }
          if (g.hit >= g.total) {
            score += g.comboPoints;
          }
        }

        const { dirty } = store.getState().simulation;
        store.dispatch(
          actions.reachedGoal({
            results: {
              score,
              time: time,
              groups: m.groups,
              timeScorePenalty,
              dirty,
            },
          }),
        );
        break;
      }
    }
  });

  return m;
}

export function toRadians(degrees: number): number {
  return degrees * Math.PI / 180.0;
}

// tag key-value regular expression
const tagKvRe = /^(.*)=(.*)$/;

export function parseTags(el: SVGElement): Tags {
  const tags: Tags = {
    type: "unknown",
  };

  const desc = el.querySelector("desc");
  if (desc) {
    let tokens = desc.textContent.split("\n");
    for (const tok of tokens) {
      if (tok.startsWith("#")) {
        tags.type = tok.replace(/^#/, "");
      } else {
        const matches = tagKvRe.exec(tok);
        if (matches) {
          tags[matches[1]] = matches[2];
        } else {
          tags[tok] = "true";
        }
      }
    }
  }
  return tags;
}

export function parseStyle(el: SVGElement, body: Body) {
  if (el.style.fill != "none") {
    body.fill = true;
    body.fillColor = toPixiColor(el.style.fill);
  }

  if (el.style.stroke != "none") {
    body.stroke = true;
    body.strokeColor = toPixiColor(el.style.stroke);
  }
}

function toPixiColor(input: string): number {
  return parseInt(tinycolor(input).toHex(), 16);
}
