// ================ CONSTANTS ================

const AUTHORS = "ejas, mbmt, tbm2 & vdj";

//canvas's size
const CANVAS_X = 500;
const CANVAS_Y = 500;

// ================ GLOBAL VARIABLES ================

// declare global variables here.
let map = [
  [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  [100, 0, 0, 0, 70, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 65, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 55, 0, 0, 0, 30, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 50, 0, 0, 0, 30, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 45, 0, 0, 0, 30, 0, 0, 0, 30, 0, 0, 0, -1, 0, 0, 100],
  [100, 0, 0, 0, 40, 0, 0, 0, 35, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 30, 0, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 20, 0, 0, 0, 45, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 10, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 5, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
  [100, 0, 0, 0, 0, 0, 0, 0, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
  [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
];
let distanceMap = [];

// ================ GENERAL FUNCTIONS ================

function drawMap() {
  noStroke();
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      if (map[i][j] == 0) {
        fill(255);
      } else if (map[i][j] == -1) {
        //replace with whey
        fill(0, 0, 255);
      } else {
        fill(getBarrierColor(map[i][j]));
      }
      rect((CANVAS_X / map.length) * i, (CANVAS_Y / map[i].length) * j, CANVAS_X / map.length + 1, CANVAS_Y / map[i].length);
    }
  }
}

function fillDistanceMap() {
  var targetI;
  var targetJ;
  for (var i = 0; i < map.length; i++) {
    distanceMap[i] = [];
    for (var j = 0; j < map[i].length; j++) {
      distanceMap[i][j] = 100;
      if (map[i][j] == -1) {
        targetI = i;
        targetJ = j;
      }
    }
  }

  distanceMap[targetI][targetJ] = 0;
  recursiveFill(targetI, targetJ);

}

function recursiveFill(i, j) {
  //v
  if (j + 1 < distanceMap[i].length) {
    if (distanceMap[i][j] + 1 < distanceMap[i][j + 1] && map[i][j + 1] == 0) {
      distanceMap[i][j + 1] = distanceMap[i][j] + 1;
      recursiveFill(i, j + 1);
    }
  }
  //^
  if (j > 0) {
    if (distanceMap[i][j] - 1 < distanceMap[i][j - 1] && map[i][j - 1] == 0) {
      distanceMap[i][j - 1] = distanceMap[i][j] - 1;
      recursiveFill(i, j + 1);
    }
  }
  //>
  if (i + 1 < distanceMap.length) {
    if (distanceMap[i][j] + 1 < distanceMap[i + 1][j] && map[i + 1][j] == 0) {
      distanceMap[i + 1][j] = distanceMap[i][j] + 1;
      recursiveFill(i + 1, j);
    }
  }
  //<
  if (i > 0) {
    if (distanceMap[i][j] + 1 < distanceMap[i - 1][j] && map[i - 1][j] == 0) {
      distanceMap[i - 1][j] = distanceMap[i][j] + 1;
      recursiveFill(i - 1, j);
    }
  }
}

function drawDistanceMap() {
  noStroke();
  for (var i = 0; i < distanceMap.length; i++) {
    for (var j = 0; j < distanceMap[i].length; j++) {
      fill(2.55 * (100 - distanceMap[i][j]), 0, 2.55 * distanceMap[i][j]);
      rect((CANVAS_X / distanceMap.length) * i, (CANVAS_Y / distanceMap[i].length) * j, CANVAS_X / distanceMap.length + 1, CANVAS_Y / distanceMap[i].length);
    }
  }
}

function getBarrierColor(strength) {
  return(2.55 * (100 -strength));
}


// ================ SETUP & DRAW ================

function setup() {
  createCanvas(CANVAS_X, CANVAS_Y);
  fillDistanceMap();
  drawMap();
}

function draw() {
  // call drawing functions here
}

// ================ CLASSES ================

// add classes of OO programming here