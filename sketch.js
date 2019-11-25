// ================ CONSTANTS ================

const AUTHORS = "ejas, mbmt, tbm2 & vdj";

// canvas's size
const CANVAS_X = 800;
const CANVAS_Y = 800;

const TARGET_SIZE = 50;
const MAX_FORCE = 1;
const MAX_STRENGTH = 100;

const toast = new Toasty();

// ================ GLOBAL VARIABLES ================

let count;
let genCount;
let target;
let barriers = [];
let addingBarrier = false;
let addBarrierDragging = false;
let playSound = true;

let LIFESPAN = 500;
let POPULATION_SIZE = 20;
let MAX_SPEED = 5;
let MUTATION_RATE = 0.005;

let bambamImage;
let wheyImage;
let birlSound;
let yearsSound;
let showSound;

// HTML objects
let frameCountSpan;
let generationCountSpan;
let maxFitnessSpan;
let soundCheck;
let setBtn;
let popSizeInput;
let lifespanInput;
let maxSpeedInput;
let mutationInput;
let addBarriersCheck;
let addBarrierStrength;
let resetBtn;

// ================ GENERAL FUNCTIONS ================

const getBarrierColor = function (strength) {
  return (255 - (2.55 * strength));
}

const addBarrier = function (x, y, width, height, strength) {
  barriers.push({ x, y, width, height, strength });
}

const drawBarriers = function () {
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

const resetPopulation = function () {
  LIFESPAN = parseInt(lifespanInput.value());
  POPULATION_SIZE = parseInt(popSizeInput.value());
  MAX_SPEED = parseInt(maxSpeedInput.value());
  MUTATION_RATE = parseFloat(mutationInput.value());

  population = new Population();
  target = createVector(CANVAS_X / 2, 50);

  count = 0;
  genCount = 1;
}

const resetAll = function() {
  barriers = [];
  resetPopulation();
}

const handleAddBarriersChange = function () {
  if(this.checked()) {
    addingBarrier = true;
  } else {
    addingBarrier = false;
  }

  if (addingBarrier) {
    toast.info('Create barriers by dragging over the map!');
  }
}

const canvasMousePressed = function () {
  if (addingBarrier) {
    barrierBegin = {
      x: mouseX,
      y: mouseY,
    }
    addBarrierDragging = true;
  }

}

const canvasMouseReleased = function () {
  if (addingBarrier) {
    let beginX = min(mouseX, barrierBegin.x);
    let endX = max(mouseX, barrierBegin.x);
    let beginY = min(mouseY, barrierBegin.y);
    let endY = max(mouseY, barrierBegin.y);

    addBarrier(beginX, beginY, endX - beginX, endY - beginY, int(addBarrierStrength.value()));
    count = LIFESPAN;
  }

  addBarrierDragging = false;
}

const toggleSound = function() {
  if(this.checked()) {
    playSound = true;
  } else {
    playSound = false;
  }
}

// ================ SETUP & DRAW ================

function preload() {
  bambamImage = loadImage('assets/images/bambam_img.png');
  wheyImage = loadImage('assets/images/whey_img.png');
  birlSound = loadSound('assets/sounds/birl.mp3');
  yearsSound = loadSound('assets/sounds/37_anos.mp3');
  showSound = loadSound('assets/sounds/hora_do_show.mp3');
}

function setup() {
  frameCountSpan = select('#frame-count');
  generationCountSpan = select('#generation-count');
  maxFitnessSpan = select('#max-fitness');
  setBtn = select('#set-btn');
  popSizeInput = select('#population-size');
  lifespanInput = select('#lifespan');
  maxSpeedInput = select('#max-speed');
  mutationInput = select('#mutation-rate');
  addBarriersCheck = select('#add-barrier');
  addBarrierStrength = select('#barrier-strength');
  resetBtn = select('#reset');
  soundCheck = select('#sound');

  popSizeInput.value(POPULATION_SIZE);
  lifespanInput.value(LIFESPAN);
  maxSpeedInput.value(MAX_SPEED);
  mutationInput.value(MUTATION_RATE);
  addBarrierStrength.value(50);

  resetPopulation();

  // Event listeners
  soundCheck.changed(toggleSound);
  setBtn.mousePressed(resetPopulation);
  addBarriersCheck.changed(handleAddBarriersChange);
  resetBtn.mousePressed(resetAll);

  let canvas = createCanvas(CANVAS_X, CANVAS_Y);
  canvas.parent('canvas-container');

  canvas.mousePressed(canvasMousePressed);
  canvas.mouseReleased(canvasMouseReleased);
}

function draw() {
  clear();
  population.run();

  // Displays count to window
  frameCountSpan.html(count);
  generationCountSpan.html(genCount);

  if (addBarrierDragging) {
    fill(204, 224, 255);
    stroke(51, 131, 255);
    strokeWeight(2);

    let beginX = min(mouseX, barrierBegin.x);
    let endX = max(mouseX, barrierBegin.x);
    let beginY = min(mouseY, barrierBegin.y);
    let endY = max(mouseY, barrierBegin.y);

    rect(beginX, beginY, endX - beginX, endY - beginY);
  }

  count++;
  if (count >= LIFESPAN) {
    genCount++;

    // "eh 37 anos" sound
    if(playSound) {
      if(genCount == 37) {
        yearsSound.play();
      } else {
        showSound.play();
      }
    }

    population.evaluate();
    population.selection();
    count = 0;
  }

  // Renders barrier for bambans
  drawBarriers();

  noStroke();
  fill(200, 150, 150);
  ellipseMode(RADIUS);
  ellipse(target.x, target.y, TARGET_SIZE);

  imageMode(CENTER);
  image(wheyImage, target.x, target.y, 2 * TARGET_SIZE, 2 * TARGET_SIZE);
}