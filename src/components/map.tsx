import {
  Joint,
  World,
  Vec2,
  DetailedFixtureDef,
  Box,
  Body,
  RevoluteJointOpts,
  T_Vec2,
  Circle,
  ShapeDef,
  FixtureDef,
  Chain,
  Polygon,
  RevoluteJoint,
  BodyType,
} from "planck-js";
const tinycolor = require("tinycolor2");
import { parseSVG, makeAbsolute } from "svg-path-parser";

const gravityY = 150;
const bigAngle = 20;
const lowAngle = 25;

export interface Map {
  leftJoints: Joint[];
  rightJoints: Joint[];
  world: World;
}

export function loadMap(xmlString: string): Map {
  const m: Map = {
    leftJoints: [],
    rightJoints: [],
    world: new World(Vec2(0, gravityY)),
  };

  const fixed = m.world.createBody();
  fixed.createFixture(Box(0, 0), 0.0);

  const doc = new DOMParser().parseFromString(xmlString, "text/xml");

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

      let jd: RevoluteJointOpts;
      let jointList: Joint[];
      let body: Body;
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
        if (tags.indexOf("#left") !== -1) {
          jd.lowerAngle = toRadians(-bigAngle);
          jd.upperAngle = toRadians(lowAngle);
          jointList = m.leftJoints;
        } else if (tags.indexOf("#right") !== -1) {
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
      if (path.style.fill != "none") {
        body.fill = true;
        body.fillColor = parseInt(tinycolor(path.style.fill).toHex(), 16);
      }

      const vecs: T_Vec2[] = [];
      for (const p of points) {
        vecs.push(Vec2(p.x + offsetX, p.y + offsetY));
      }

      const shapeDef: ShapeDef = {
        density: isStatic ? 0.0 : 0.1,
        filterGroupIndex,
      };
      let fixtureDef: FixtureDef;
      if (isStatic) {
        fixtureDef = Chain(vecs, false);
      } else {
        fixtureDef = Polygon(vecs);
      }
      body.createFixture(fixtureDef, shapeDef);

      if (jd) {
        const joint = RevoluteJoint(jd, fixed, body, pos);
        m.world.createJoint(joint);
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
      let type: BodyType = "dynamic";
      let bullet = true;
      let isSensor = false;

      if (tags.indexOf("#collect") !== -1) {
        type = "static";
        density = 0.0;
        bullet = false;
        isSensor = true;
      }

      const body = m.world.createBody({
        position,
        type,
        bullet,
      });
      body.tags = tags;
      const ddef: DetailedFixtureDef = {
        shape: Circle(radius),
      };
      if (isSensor) {
        ddef.isSensor = true;
      }
      body.createFixture(ddef, {
        density: 0.02,
      });
    }
  }

  m.world.on("begin-contact", function(contact) {
    let bodyA = contact.getFixtureA().getBody();
    let bodyB = contact.getFixtureB().getBody();
    console.log(
      JSON.stringify(bodyA.tags),
      `has contact with`,
      JSON.stringify(bodyB.tags),
    );
  });

  return m;
}

export function toRadians(degrees: number): number {
  return degrees * Math.PI / 180.0;
}
