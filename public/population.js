function Population() {
  // Array of bambans
  this.bambans = [];
  // Amount of bambans
  this.popsize = POPULATION_SIZE;
  // Amount parent bambam partners
  this.matingpool = [];

  // Associates a bambam to an array index
  for (let i = 0; i < this.popsize; i++) {
    this.bambans[i] = new BamBam();
  }

  this.resetPosition = function() {
    for(let i = 0; i < this.bambans.length; i++) {
      this.bambans[i].pos.set(0, 0);
    }
  }

  this.evaluate = function() {

    let maxfit = 0;
    // Iterate through all bambans and calcultes their fitness
    for (let i = 0; i < this.popsize; i++) {
      // Calculates fitness
      this.bambans[i].calcFitness();
      // If current fitness is greater than max, then make max equal to current
      if (this.bambans[i].fitness > maxfit) {
        maxfit = this.bambans[i].fitness;
      }
    }

    // Sets the paragraph text with rounded fitness
    maxFitnessSpan.html(round(maxfit))

    // Normalises fitnesses
    for (let i = 0; i < this.popsize; i++) {
      this.bambans[i].fitness /= maxfit;
    }

    this.matingpool = [];
    // Take bambans fitness make in to scale of 1 to 100
    // A bambam with high fitness will highly likely will be in the mating pool
    for (let i = 0; i < this.popsize; i++) {
      let n = this.bambans[i].fitness * 100;
      
      for (let j = 0; j < n; j++) {
        this.matingpool.push(this.bambans[i]);
      }
    }
  }

  // Selects appropriate genes for child
  this.selection = function() {
    let newBambans = [];
    for (let i = 0; i < this.bambans.length; i++) {
      // Picks random dna
      let parentA = random(this.matingpool).dna;
      let parentB = random(this.matingpool).dna;
      // Creates child by using crossover function
      let child = parentA.crossover(parentB);
      child.mutation();
      // Creates new bambam with child dna
      newBambans[i] = new BamBam(child);
    }
    // This instance of bambans are the new bambans
    this.bambans = newBambans;
  }

  // Calls for update and show functions
  this.run = function() {
    for (let i = 0; i < this.popsize; i++) {
      for(let j = 0; j < SPEED_MULTIPLIER; j++ ){
        count ++;
        this.bambans[i].update();
      }
      count -= SPEED_MULTIPLIER;
      // Displays bambans to screen
      if(SPEED_MULTIPLIER <= 10){
        this.bambans[i].show();
      }
    }
  }

  this.allStoped = function(){
    let result = true;
    for(let i = 0; i < this.bambans.length;i++){
      if(!this.bambans[i].stop){
        return false;
      }
    }
    return result;
  }
}