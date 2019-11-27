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
  this.completedTime = null;
  this.stop = false;
  // ========== END CONSTRUCTOR ==========


  // ========== FUNCTIONS ==========
  this.getDistanceFromObjective = function() {

    // Replace this with A*
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    return d;
  }

  this.getStrength = function() {
    return (MAX_STRENGTH - (this.dna.genes.ratio * MAX_STRENGTH));
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.update = function() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    // If distance is grater than target size, is completed!
    if(d <= TARGET_SIZE) {
      this.completed = true;

      // get the first time that reached target
      if(!this.completedTime) {

        // only if soud is cheched
        if(playSound) {
          birlSound.play();
        }

        this.completedTime = count;
      }
      this.pos = target.copy();
    }

    this.stop = false;

    barriers.forEach((b) => {
      // BamBam hit the barrier
      if (this.pos.x > b.x && this.pos.x < b.x + b.width && this.pos.y > b.y && this.pos.y < b.y + b.height) {

        // if can't break barrier, don't move
        if(this.getStrength() < b.strength) {
          this.stop = true;
        }
      }
    });

    // BamBam has hit left or right of window
    if (this.pos.x > CANVAS_X || this.pos.x < 0) {
      this.stop = true;
    }

    // BamBam has hit top or bottom of window
    if (this.pos.y > CANVAS_Y || this.pos.y < 0) {
      this.stop = true;
    }
    
    // Only if BamBam can move
    if(!this.stop) {
      this.applyForce(this.dna.genes.vectors[count]);
      this.vel.add(this.acc);
      this.pos.add(p5.Vector.mult(this.vel, this.dna.genes.ratio));
      this.acc.mult(0);
      this.vel.limit(MAX_SPEED);
    }

  }

  this.calcFitness = function() {
    let distance = this.getDistanceFromObjective();
    // Maps range of fitness
    let diagonalLength = dist(0, 0, CANVAS_X, CANVAS_Y);
    let partial = map(distance, 0, diagonalLength, 100, 0);
    this.fitness = partial * partial;
    // If bambam gets to target increase fitness of bambam
    if (this.completed) {
      // favors who completes faster
      let mapped = map(this.completedTime, 0, LIFESPAN, 15, 5);
      this.fitness *= mapped;
    }
  }

  this.getColor = function() {
    return ({
      r: 255 * this.dna.genes.ratio,
      g: 255 * (1-this.dna.genes.ratio),
      b: 0,
    });
  }

  this.show = function() {
    // push and pop allow's rotating and translation not to affect other objects
    push();
    
    // color customization of bambam
    noStroke();
    let colorObject = this.getColor();
    fill(colorObject.r, colorObject.g, colorObject.b);
    
    // translate to the postion of bambam
    translate(this.pos.x, this.pos.y);
    
    imageMode(CENTER);
    image(bambamImage, 0, 0, 40, 40);
    
    fill(0);
    textAlign(CENTER, CENTER);
    let strength = floor((1-this.dna.genes.ratio)*100);
    text(strength, 0, -30);
    // // Strength bar on top
    // rectMode(CORNER);
    // rect(-15, -30, (1 - this.dna.genes.ratio) * 40, 5);
    
    pop();

  }
  // ========== END FUNCTIONS ==========
}