// ================ CONSTANTS ================

const AUTHORS = "ejas, mbmt, tbm2 & vdj";

// canvas's size
const CANVAS_X = 800;
const CANVAS_Y = 800;

const LIFESPAN = 500;
const TARGET_SIZE = 50;
const MAX_FORCE = 100;

// ================ GLOBAL VARIABLES ================

let lifeP;
let count = 0;
let target;
let barriers = [];

// ================ GENERAL FUNCTIONS ================

const getBarrierColor = function(strength) {
  return (255 - (2.55 * strength));
}

const addBarrier = function(x, y, width, height, strength) {
  barriers.push({x, y, width, height, strength});
}

const drawBarriers = function() {
  barriers.forEach((b) => {
    let color = getBarrierColor(b.strength);
    strokeWeight(0);
    fill(color);
    rect(b.x, b.y, b.width, b.height);
  })
}

// ================ SETUP & DRAW ================

function setup() {
  createCanvas(CANVAS_X, CANVAS_Y);

  addBarrier(100, 120, 100, 40, 80);
  addBarrier(300, 500, 200, 40, 40);
  addBarrier(200, 300, 500, 60, 70);


  population = new Population();
  lifeP = createP();
  target = createVector(CANVAS_X / 2, 50);
}

function draw() {
  clear();
  population.run();
  // Displays count to window
  lifeP.html(count);

  count++;
  if (count == LIFESPAN) {
    population.evaluate();
    population.selection();
    count = 0;
  }

  // Renders barrier for bambans
  drawBarriers();

  fill('blue');
  ellipseMode(RADIUS)
  ellipse(target.x, target.y, TARGET_SIZE);
}

// ================ CLASSES ================

// add classes of OO programming here