function BamBam(dna) {

  // ========== CONSTRUCTOR ==========
  this.pos = createVector(CANVAS_X/2, CANVAS_Y);
  this.vel = createVector();
  this.acc = createVector();

  // speed is grater when ratio is closer to 1
  // strength is grater when ratio is closer to 0

  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  this.fitness = 0;
  this.completed = false;
  // ========== END CONSTRUCTOR ==========


  // ========== FUNCTIONS ==========
  this.getDistanceFromObjective = function() {

    // Replace this with A*
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    return d;
  }

  this.getStrength = function() {
    return (MAX_FORCE - (this.dna.genes.ratio * MAX_FORCE));
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.update = function() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    // If distance is grater than target size, is completed!
    if(d <= TARGET_SIZE) {
      this.completed = true;
      this.pos = target.copy();
    }

    let stop = 0;

    barriers.forEach((b) => {
      // BamBam hit the barrier
      if (this.pos.x > b.x && this.pos.x < b.x + b.width && this.pos.y > b.y && this.pos.y < b.y + b.height) {

        // if can't break barrier, don't move
        if(this.getStrength() < b.strength) {
          stop = 1;
        }
      }

      // BamBam has hit left or right of window
      if (this.pos.x > CANVAS_X || this.pos.x < 0) {
        stop = 1;
      }

      // BamBam has hit top or bottom of window
      if (this.pos.y > CANVAS_Y || this.pos.y < 0) {
        stop = 1;
      }
    });

    
    // Only if BamBam can move
    if(!stop) {
      this.applyForce(this.dna.genes.vectors[count]);
      this.vel.add(this.acc);
      this.pos.add(p5.Vector.mult(this.vel, this.dna.genes.ratio));
      this.acc.mult(0);
      this.vel.limit(5);
    }

  }

  this.calcFitness = function() {
    let distance = this.getDistanceFromObjective();
    // Maps range of fitness
    let diagonalLength = dist(0, 0, CANVAS_X, CANVAS_Y);
    let partial = map(distance, 0, diagonalLength, 100, 0);
    this.fitness = partial * partial;
    // If rocket gets to target increase fitness of rocket
    if (this.completed) {
      this.fitness *= 10;
    }
  }

  this.getColor = function() {
    return (255*this.dna.genes.ratio);
  }

  this.show = function() {
    // push and pop allow's rotating and translation not to affect other objects
    push();
    //color customization of rockets
    noStroke();
    fill(this.getColor());
    
    //translate to the postion of rocket
    translate(this.pos.x, this.pos.y);
    //rotatates to the angle the rocket is pointing
    ellipse(0, 0, 8)
    //creates a rectangle shape for rocket
    pop();

  }
  // ========== END FUNCTIONS ==========
}