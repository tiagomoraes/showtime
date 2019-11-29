function DNA(genes) {
  // Recieves genes and create a dna object
  if (genes) {
    this.genes = genes;
  }

  // If no genes just create random dna
  else {
    this.genes = {};
    this.genes.ratio = 0.5;
    this.genes.vectors = [];
    for (let i = 0; i < LIFESPAN; i++) {
      // Gives random vectors
      this.genes.vectors[i] = p5.Vector.random2D();
      // Sets maximum force of vector to be applied to a bambam
      this.genes.vectors[i].setMag(MAX_FORCE);
    }
  }
  
  // Performs a crossover with another member of the species
  this.crossover = function(partner) {
    let newgenes = {};
    newgenes.vectors = [];

    // Sets strength as a random value between both max strengths
    newgenes.ratio = random(this.genes.ratio, partner.genes.ratio);

    // Picks random midpoint
    let mid = floor(random(this.genes.vectors.length));
    for (let i = 0; i < this.genes.vectors.length; i++) {
      // If i is greater than mid the new gene should come from this partner
      if (i > mid) {
        newgenes.vectors[i] = this.genes.vectors[i];
      }
      // If i < mid new gene should come from other partners gene's
      else {
        newgenes.vectors[i] = partner.genes.vectors[i];
      }
    }
    // Gives DNA object an array
    return new DNA(newgenes);
  }

  // Adds random mutation to the genes.
  this.mutation = function() {
    if (random(1) < MUTATION_RATE*40) {
      this.genes.ratio = random(this.genes.ratio - 0.1, this.genes.ratio + 0.1);
    }
    
    for (let i = 0; i < this.genes.vectors.length; i++) {

      // if random number less than 0.01, new gene is then random vector
      if (random(1) < MUTATION_RATE) {
        if(this.genes.ratio > 1) {
          this.genes.ratio = 1;
        }
        this.genes.vectors[i] = p5.Vector.random2D();
        this.genes.vectors[i].setMag(MAX_FORCE);
      }
    }
  }

}