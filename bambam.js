function BamBam(dna) {
  // ========== CONSTRUCTOR ==========
  this.pos = createVector(CANVAS_X/2, CANVAS_Y-20);
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
  // ========== END CONSTRUCTOR ==========


  // ========== FUNCTIONS ==========
  this.getDistanceFromObjective = function() {

    // Replace this with A*
    let d = aStar(parseInt(Math.floor(this.pos.x)), Math.floor(parseInt(this.pos.y)), Math.floor(parseInt(target.x)), Math.floor(parseInt(target.y)), this.getStrength());
    // barriers.forEach((b) => {
    //   console.log(b);
    // });
    //console.log(d + ' ' + dist(this.pos.x, this.pos.y, target.x, target.y));
    return d;
  }

  let isValid = function(x, y, strength) {
    if (x >= 0 && x <= CANVAS_X && y >= 0 && y <= CANVAS_Y && strength >= map_matrix[x][y].strength) {
      return true;
    } else return false;
  }

  let isLess = function(new_dist, actual_dist) {
    return new_dist < actual_dist;
  }

  let heuristic = function(x, y) {
    return map_matrix[x][y].d;
  }

  let aStar = function(x, y, tx, ty, strength) {
    x = max(0, x), y = max(0, y);
    x = min(CANVAS_X, x), y = min(CANVAS_Y, y);
    let heap = new BinaryHeap((elem) => {
      return elem.d;
    });
    
    setInfMatrix();
    heap.push({point: {x: x, y: y}, d: heuristic(x, y)});
    map_matrix[x][y].v = heuristic(x, y);
    
    while (heap.size() > 0) {
      
      let current = heap.pop();

      //if (current.d > map_matrix.v) continue;
      
      let cx = current.point.x, cy = current.point.y;

      let h_old = heuristic(cx, cy);
      let h_new;
      
      if (cx == tx && cy == ty) {
        return current.d;
      }
      
      if (isValid(cx+1, cy, strength)) {
        h_new = heuristic(cx+1, cy);
        if (isLess(current.d + 1 + h_new, map_matrix[cx+1][cy].v)) {
          map_matrix[cx+1][cy].v = current.d + 1 + h_new- h_old;
          heap.push({point: {x: cx+1, y:cy}, 
                              d: current.d + 1 + h_new - h_old}); 
        }
      }
      
      if (isValid(cx, cy+1, strength)) {
        h_new = heuristic(cx, cy+1);
        if (isLess(current.d + 1 + h_new, map_matrix[cx][cy+1].v)) {
          map_matrix[cx][cy+1].v = current.d + 1 + h_new - h_old;
          heap.push({point: {x: cx, y:cy+1}, 
                              d: current.d + 1 + h_new - h_old});
        }
      }
      
      if (isValid(cx-1, cy, strength)) {
        h_new = heuristic(cx-1, cy);
        if (isLess(current.d + 1 + h_new, map_matrix[cx-1][cy].v)) {
          map_matrix[cx-1][cy].v = current.d + 1 + h_new - h_old;
          heap.push({point: {x: cx-1, y:cy}, 
                              d: current.d + 1 + h_new - h_old}); 
        }
      }
      
      if (isValid(cx, cy-1, strength)) {
        h_new = heuristic(cx, cy-1);
        if (isLess(current.d + 1 + h_new, map_matrix[cx][cy-1].v)) {
          map_matrix[cx][cy-1].v = current.d + 1 + h_new - h_old;
          heap.push({point: {x: cx, y:cy-1}, 
            d: current.d + 1 + h_new - h_old});
        }
      }
    }
    console.log(x + ' ' + y);
    return INF;
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

    let stop = 0;

    barriers.forEach((b) => {
      // BamBam hit the barrier
      if (this.pos.x+10 >= b.x && this.pos.x-10 <= b.x + b.width && this.pos.y+10 >= b.y && this.pos.y-10 <= b.y + b.height) {

        // if can't break barrier, don't move
        if(parseInt(Math.floor(this.getStrength())) < b.strength) {
          //while (this.pos.x >= b.x) this.pos.x = this.pos.x - 2;
          //while (this.pos.x <= b.x + b.width) this.pos.x = this.pos.x + 2;
          //while (this.pos.y >= b.y) this.pos.y = this.pos.y - 2;
          //while (this.pos.y <= b.y + b.height) this.pos.y = this.pos.y + 2;
          stop = 1;
        }
      }
    });

    // BamBam has hit left or right of window
    if (this.pos.x+10 > CANVAS_X || this.pos.x-10 < 0) {
      stop = 1;
    }

    // BamBam has hit top or bottom of window
    if (this.pos.y+10 > CANVAS_Y || this.pos.y-10 < 0) {
      stop = 1;
    }
    
    // Only if BamBam can move
    if(!stop) {
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