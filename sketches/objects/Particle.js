import p5 from "p5";

export default class Particle {
  constructor(x, y, dampening = 0.99) {
    this.acceleration = new p5.Vector(0, 0);
    this.velocity = new p5.Vector(0, 0);
    this.position = new p5.Vector(x, y);
    this.mass = 1;
    this.locked = false;
    this.dampening = dampening;
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
  }

  // Method to update position
  update() {
    if (this.locked) return;

    this.velocity.mult(this.dampening);

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  // Method to display
  draw(p) {
    p.stroke(255);
    p.strokeWeight(2);
    p.fill(45, 197, 244);
    p.ellipse(this.position.x, this.position.y, 10);
  }
}
