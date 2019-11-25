// ================ CONSTANTS ================

const AUTHORS = "ejas, mbmt, tbm2 & vdj";

// canvas's size
const CANVAS_X = 800;
const CANVAS_Y = 800;

const TARGET_SIZE = 50;
const MAX_FORCE = 100;

// ================ GLOBAL VARIABLES ================

let count;
let genCount;
let target;
let barriers = [];

let LIFESPAN = 500;
let POPULATION_SIZE = 20;

let bambamImage;
let wheyImage;

// HTML objects
let frameCountSpan;
let generationCountSpan;
let maxFitnessSpan;
let setBtn;
let popSizeInput;
let lifespanInput;

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

    fill(0);
    textAlign(CENTER, CENTER);
    text(b.strength, b.x, b.y, b.width, b.height);
  })
}

const resetPopulation = function() {
  LIFESPAN = int(lifespanInput.value());
  POPULATION_SIZE = int(popSizeInput.value());
  
  population = new Population();
  target = createVector(CANVAS_X / 2, 50);

  count = 0;
  genCount = 0;

  barriers = [];

  addBarrier(100, 100, 30, 200, 50);
  addBarrier(200, 200, 150, 30, 70);
  addBarrier(500, 300, 200, 30, 70);
  addBarrier(000, 400, 300, 30, 20);
  addBarrier(300, 500, 200, 30, 70);
  addBarrier(000, 600, 200, 30, 30);
  addBarrier(400, 600, 300, 30, 60);

}

// ================ SETUP & DRAW ================

function preload() {
  bambamImage = loadImage('../assets/images/bambam_img.png');
  wheyImage = loadImage('../assets/images/whey_img.png');
  birlSound = loadSound('../assets/sounds/birl.mp3');
}

function setup() {  
  frameCountSpan = select('#frame-count');
  generationCountSpan = select('#generation-count');
  maxFitnessSpan = select('#max-fitness');
  setBtn = select('#set-btn');
  popSizeInput = select('#population-size');
  lifespanInput = select('#lifespan');
  
  popSizeInput.value(POPULATION_SIZE);
  lifespanInput.value(LIFESPAN);

  resetPopulation();

  setBtn.mousePressed(resetPopulation);

  let canvas = createCanvas(CANVAS_X, CANVAS_Y);
  canvas.parent('canvas-container');
}

function draw() {
  clear();
  population.run();

  // Displays count to window
  frameCountSpan.html(count);
  generationCountSpan.html(genCount + 1);

  count++;
  if (count == LIFESPAN) {
    genCount++;
    population.evaluate();
    population.selection();
    count = 0;
  }

  // Renders barrier for bambans
  drawBarriers();

  fill('green');

  imageMode(CENTER);
  image(wheyImage, target.x, target.y, 2*TARGET_SIZE, 2*TARGET_SIZE);

  noFill();
  stroke('blue');
  strokeWeight(4);
  ellipseMode(RADIUS);
  ellipse(target.x, target.y, TARGET_SIZE)

}