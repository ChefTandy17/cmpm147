// sketch.js - Creates a generative dungeon
// Author: Tyvin Tandy
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
let roomCenters = [];

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

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
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    return grid[i][j] == target;
  } else {
    return false;
  }
}
//check to figure out which tile needs a autotiling
function gridCode(grid, i, j, target) {
  const north = gridCheck(grid, i - 1, j, target);
  const south = gridCheck(grid, i + 1, j, target);
  const east = gridCheck(grid, i, j + 1, target);
  const west = gridCheck(grid, i, j - 1, target);
  return (north << 0) + (south << 1) + (east << 2) + (west << 3);
}

function drawContext(grid, i, j, target, ti, tj, lookupTable) {
  const tileCode = gridCode(grid, i, j, target);
  const tileOffset = lookupTable[tileCode];

  if (tileOffset) {
    const offsetI = tileOffset[0];
    const offsetJ = tileOffset[1];
    placeTile(i, j, offsetI + ti, offsetJ + tj);
  }
}

//solid red tiles only

const redLookup = [
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
];

//solid black tiles only
const blackLookup = [
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
  [20, 22],
];

const blackDungeonEdge = [
  [20, 22], // none
  [26, 23], // N
  [26, 21], // S
  [20, 22], // NS
  [25, 22], // E
  [25, 23], // NE
  [25, 21], // SE
  [25, 22], // NSE
  [20, 22], // W
  [27, 23], // NW
  [27, 21], // SW
  [27, 22], // NSW
  [20, 22], // EW
  [26, 23], // NEW
  [26, 21], // SEW
  [20, 22], // NSEW
];

function generateGrid(numCols, numRows) {
  roomCenters = [];
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  let roomWidth = Math.floor(random(4, 6));
  let roomHeight = Math.floor(random(4, 6));

  let roomX = Math.floor((numCols - roomWidth) / 2);
  let roomY = Math.floor((numRows - roomHeight) / 2);

  for (let y = roomY; y < roomY + roomHeight; y++) {
    for (let x = roomX; x < roomX + roomWidth; x++) {
      grid[y][x] = "b";
    }
  }

  //track the center of the main room
  roomCenters.push([
    Math.floor(roomY + roomHeight / 2),
    Math.floor(roomX + roomWidth / 2),
  ]);

  //generate additional random rooms
  let roomCount = Math.floor(random(1, 3));
  for (let i = 0; i < roomCount; i++) {
    randomRoom(grid, numCols, numRows);
  }

  //Connect all room centers
  connectRooms(grid);

  return grid;
}

function randomRoom(grid, numCols, numRows) {
  let maxAttempts = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let roomWidth = Math.floor(random(4, 8));
    let roomHeight = Math.floor(random(4, 8));

    let roomX = Math.floor(random(1, numCols - roomWidth - 1));
    let roomY = Math.floor(random(1, numRows - roomHeight - 1));

    if (canPlaceRoom(grid, roomX, roomY, roomWidth, roomHeight)) {
      for (let y = roomY; y < roomY + roomHeight; y++) {
        for (let x = roomX; x < roomX + roomWidth; x++) {
          grid[y][x] = "r";
        }
      }

      //track the center of the room
      const centerY = Math.floor(roomY + roomHeight / 2);
      const centerX = Math.floor(roomX + roomWidth / 2);
      roomCenters.push([centerY, centerX]);

      break;
    }
  }
}

//helper function to check if the rooms could be placed
function canPlaceRoom(grid, x, y, width, height) {
  for (let j = y; j < y + height; j++) {
    for (let i = x; i < x + width; i++) {
      if (grid[j][i] !== "_") {
        return false;
      }
    }
  }
  return true;
}

//connects the room with one room with another, using many helper functions to determine
//how the hallways would be carved out. this is generated by AI
function connectRooms(grid) {
  for (let i = 1; i < roomCenters.length; i++) {
    const [y1, x1] = roomCenters[i - 1];
    const [y2, x2] = roomCenters[i];

    if (random() < 0.5) {
      carveHorizontalTunnel(grid, x1, x2, y1);
      carveVerticalTunnel(grid, y1, y2, x2);
    } else {
      carveVerticalTunnel(grid, y1, y2, x1);
      carveHorizontalTunnel(grid, x1, x2, y2);
    }
  }
}

//helper functions to create the hallways
function carveHorizontalTunnel(grid, x1, x2, y) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    grid[y][x] = "h"; //hallway tile
  }
}

function carveVerticalTunnel(grid, y1, y2, x) {
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    grid[y][x] = "h"; //hallway tile
  }
}

function drawGrid(grid) {
  background(128);

  const tileStyles = {
    b: [blackLookup],
    r: [redLookup],
  };

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const tile = grid[i][j];

      if (tile === "h") {
        placeTile(i, j, 20, 22);
      } else if (tileStyles[tile]) {
        tileStyles[tile].forEach((lookup) => {
          drawContext(grid, i, j, tile, 0, 0, lookup);
          if (grid[i][j] === "b") {
            let randomChest = random([0, 0, 0, 0, 0, 1]);
            if (randomChest === 1) {
              placeTile(i, j, 3, 28);
            }
          } else if (grid[i][j] === "r") {
            let randomGoldChest = random([0, 0, 0, 0, 0, 0, 0, 0, 1]);
            if (randomGoldChest === 1) {
              placeTile(i, j, 5, 28);
            }
          }
        });
      } else {
        // Random fallback
        placeTile(
          i,
          j,
          floor(random([21, 22, 23, 24])),
          floor(random([21, 22, 23, 24]))
        );
      }
    }
  }
}