function Population() {
  // Array of bambans
  this.bambans = [];
  // Amount of bambans
  this.popsize = 50;
  // Amount parent rocket partners
  this.matingpool = [];

  // Associates a rocket to an array index
  for (var i = 0; i < this.popsize; i++) {
    this.bambans[i] = new BamBam();
  }

  this.evaluate = function() {

    var maxfit = 0;
    // Iterate through all bambans and calcultes their fitness
    for (var i = 0; i < this.popsize; i++) {
      // Calculates fitness
      this.bambans[i].calcFitness();
      // If current fitness is greater than max, then make max equal to current
      if (this.bambans[i].fitness > maxfit) {
        maxfit = this.bambans[i].fitness;
      }
    }

    console.log('Max Fitness = ' + maxfit)

    // Normalises fitnesses
    for (var i = 0; i < this.popsize; i++) {
      this.bambans[i].fitness /= maxfit;
    }

    this.matingpool = [];
    // Take bambans fitness make in to scale of 1 to 100
    // A rocket with high fitness will highly likely will be in the mating pool
    for (var i = 0; i < this.popsize; i++) {
      var n = this.bambans[i].fitness * 100;
      
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.bambans[i]);
      }
    }
    console.log(this.matingpool.length)
  }

  // Selects appropriate genes for child
  this.selection = function() {
    var newBambans = [];
    for (var i = 0; i < this.bambans.length; i++) {
      // Picks random dna
      var parentA = random(this.matingpool).dna;
      var parentB = random(this.matingpool).dna;
      // Creates child by using crossover function
      var child = parentA.crossover(parentB);
      child.mutation();
      // Creates new rocket with child dna
      newBambans[i] = new BamBam(child);
    }
    // This instance of bambans are the new bambans
    this.bambans = newBambans;
  }

  // Calls for update and show functions
  this.run = function() {
    for (var i = 0; i < this.popsize; i++) {
      this.bambans[i].update();
      // Displays bambans to screen
      this.bambans[i].show();
    }
  }
}