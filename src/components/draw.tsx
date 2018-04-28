import { Body } from "clonable-planck-js";

export function drawBody(body: Body, gfx: PIXI.Graphics) {
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
