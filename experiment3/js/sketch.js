// sketch.js - creates a generative world
// Author:Tyvin Tandy
// Date: 4/20/25

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

let waterAnims = [];

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  //to
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

//provided by Profesor Wes Modes to create autotiling...
//...from the gridCheck, gridCode, drawContext, and lookup
function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length){
    return grid[i][j] == target;
  }
  else{
    return false;
  }
}

//check to figure out which tile needs a autotiling
function gridCode(grid, i, j, target) {
  const north = gridCheck(grid, i - 1, j, target);
  const south = gridCheck(grid, i + 1, j, target);
  const east  = gridCheck(grid, i, j + 1, target);
  const west  = gridCheck(grid, i, j - 1, target);
  return (north << 0) + (south << 1) + (east << 2) + (west << 3);
}

function drawContext(grid, i, j, target, ti, tj, lookupTable) {
  const tileCode = gridCode(grid, i, j, target);
  const tileOffset = lookupTable[tileCode];

  //to create water animation
  if (tileOffset) {
    let offsetI = tileOffset[0];
    let offsetJ = tileOffset[1];

    if (target === 'w') {
      const frame = floor((millis() / 300 + waterAnims[i][j]) % 4); 
      offsetI += frame;    
    }
    placeTile(i, j, offsetI + ti, offsetJ + tj);
  }
}

//solid grass tiles only
const grassLookup = [
  [0, 1], [0, 1], [0, 1], [0, 1],
  [0, 1], [0, 1], [0, 1], [0, 1],
  [0, 1], [0, 1], [0, 1], [0, 1],
  [0, 1], [0, 1], [0, 1], [0, 1],
];

//solid water tiles only
const waterLookup = [
  [0, 13], [0, 13], [0, 13], [0, 13],
  [0, 13], [0, 13], [0, 13], [0, 13],
  [0, 13], [0, 13], [0, 13], [0, 13],
  [0, 13], [0, 13], [0, 13], [0, 13],
];

//solid sand tiles only
const sandLookup = [
  [0, 18], [0, 18], [0, 18], [0, 18],
  [0, 18], [0, 18], [0, 18], [0, 18],
  [0, 18], [0, 18], [0, 18], [0, 18],
  [0, 18], [0, 18], [0, 18], [0, 18],
];

//autotiling grass
const grassEdge = [
  [0, 1], //none
  [5, 2], //North
  [5, 0], //South
  [6, 1], //NS   (idk)
  [5, 2], //East
  [4, 2], //NE
  [4, 0], //SE
  [4, 1], //NSE  
  [4, 1], //West 
  [6, 2], //NW
  [6, 0], //SW
  [6, 1], //NSW  (idk)
  [0, 1], //EW   (idk)
  [5, 2], //NEW  
  [5, 0], //SEW  
  [0, 1], //NSEW
];

//autotiling sand
const sandEdge = [
  [0, 18], //none
  [5, 20], //North
  [5, 18], //South
  [0, 18], //NS   (idk)
  [4, 19], //East
  [4, 20], //NE
  [4, 18], //SE
  [4, 19], //NSE  (idk)
  [6, 19], //West 
  [6, 20], //NW
  [6, 18], //SW
  [6, 19], //NSW  (idk)
  [5, 18], //EW   (idk)
  [5, 20], //NEW  (idk)
  [5, 18], //SEW  (idk)
  [0, 18], //NSEW
];

///////////////////////////////////////////////////


function generateGrid(numCols, numRows) {
  let grid = [];
  waterAnims = [];                          //array to store the individual animation  

  for (let i = 0; i < numRows; i++) {
    let row = [];
    let delay = [];
    for (let j = 0; j < numCols; j++) {
      let riverNoise = 1 * noise(i * 0.1) * (j * 0.3); 
      let grassNoise = 0.5 * noise(i * 0.1) * (j * 0.2);
      
      if (riverNoise < 0.8) {
        row.push("w");
        delay.push(floor(random(0, 101)));  //to create a delay
      } 
      else if (grassNoise > 0.6) {
        row.push("g");
      } 
      else {
        row.push("s");
      }
    }
    grid.push(row);
    waterAnims.push(delay);
  }

  return grid;
}


function drawGrid(grid) {
  background(128);

  // Map tile types to their solid tile lookup table
  const tileStyles = {
    'w': [waterLookup],
    'g': [grassLookup, grassEdge],
    's': [sandLookup, sandEdge]
  };

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if(tileStyles[grid[i][j]]){
        tileStyles[grid[i][j]].forEach(lookup => {
          drawContext(grid, i, j, grid[i][j], 0, 0, lookup);
          //randomly spawn grass or tree tiles
          if(grid[i][j] === 'g'){
            let randomTree = random([0,0,0,0,1,2,3]);
            if(randomTree === 2){                                              //to spawn grass
              placeTile(i, j, 1, 1)
            }
            else if(randomTree === 1){                                        //to spawn trees
              placeTile(i, j, floor(random([14,14,14,14,14,15]), 0))
            }  
            else if(randomTree === 3){  
              let randomHouse = random([0, 0, 0, 1]);//to spawn a house
              if(randomHouse === 1){                                              //to spawn grass
                placeTile(i, j, 26, 0)
              }
            } 
          }
          //randomly spawn dunes
          if(grid[i][j] === 's'){
            let randomDunes = random([0,0,0,0,0,1]);
            if(randomDunes === 1){                                  //to spawn grass
              placeTile(i, j, floor(random(4)), 18);
            }
          }
          if(grid[i][j] === '2'){
            let randomDunes = random([0,0,0,0,0,1]);
            if(randomDunes === 1){                                  //to spawn grass
              placeTile(i, j, floor(random(4)), 18);
            }
          }
        })
      } 
      else {
        placeTile(i, j, floor(random(4)), 0);
      }
    }
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}