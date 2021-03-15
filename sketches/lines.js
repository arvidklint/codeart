import p5 from "p5";
import Particle from "./objects/Particle";
import Spring from "./objects/Spring";

const K = 5;
const FORCE = 0.5;

function createLineFromAngle(center, angle, radius, amount, reflectAngle) {
  let line = [];
  const pos1 = p5.Vector.fromAngle(angle + reflectAngle, radius);
  const pos2 = pos1.copy();
  const reflectVector = p5.Vector.fromAngle(reflectAngle, 10);
  pos2.reflect(reflectVector);
  pos1.add(center);
  pos2.add(center);
  const distX = pos2.x - pos1.x;
  const distY = pos2.y - pos1.y;

  for (let i = 0; i < amount; i++) {
    const x = pos1.x + i * (distX / (amount - 1));
    const y = pos1.y + i * (distY / (amount - 1));
    const spring = {};
    spring.anchor = new Particle(x, y);
    spring.buoy = new Particle(x, y, 0.95);
    const dist = p5.Vector.dist(new p5.Vector(x, y), center);
    spring.spring = new Spring(
      K * (1 / (radius * 2 - dist)),
      0,
      spring.anchor,
      spring.buoy
    );
    line.push(spring);
  }
  return line;
}

export default function sketch(p) {
  let lines = [];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    const center = p.createVector(p.width / 2, p.height / 2);

    const nrOfLines = 24;
    const nrOfPoints = 8;
    const radius = Math.min(p.width / 4, p.height / 4);

    // horizontal
    for (let i = 0; i < nrOfLines; i++) {
      if (i === 0) continue;
      const angle = p.map(i, 0, nrOfLines, -p.PI / 2, p.PI / 2);
      lines.push(createLineFromAngle(center, angle, radius, nrOfPoints, 0));
    }
  };

  p.draw = function () {
    p.background(30);

    const mousePos = p.createVector(p.mouseX, p.mouseY);
    lines.map((springs) => {
      springs.map((spring) => {
        spring.spring.update();
        const force = p5.Vector.sub(spring.buoy.position, mousePos).normalize();
        const magnitude = force.mag();
        force.mult((1 / magnitude) * FORCE);
        spring.buoy.applyForce(force);
        spring.buoy.update();
      });
    });

    p.noFill();
    p.strokeWeight(4);
    p.stroke(255);
    lines.map((springs) => {
      p.beginShape();
      p.curveVertex(springs[0].anchor.position.x, springs[0].anchor.position.y);
      springs.map((spring) => {
        // spring.anchor.draw(p);
        // spring.buoy.draw(p);
        // spring.spring.draw(p);

        p.curveVertex(spring.buoy.position.x, spring.buoy.position.y);
      });
      p.curveVertex(
        springs[springs.length - 1].anchor.position.x,
        springs[springs.length - 1].anchor.position.y
      );
      p.endShape();
    });
  };
}
