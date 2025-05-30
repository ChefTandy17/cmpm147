// sketch.js - creates a generative world
// Author:Tyvin Tandy
// Date: 4/20/25

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

let tile_width_step_main; // A width step is half a tile's width
let tile_height_step_main; // A height step is half a tile's height

let worldSeed;


// Global variables. These will mostly be overwritten in setup().
let tile_rows, tile_columns;
let camera_offset;
let camera_velocity;

function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i + camera_x, j + camera_y];
}

function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main;
  let j = (world_x + world_y) * tile_height_step_main;
  return [i, j];
}

function tileRenderingOrder(offset) {
  return [offset[1] - offset[0], offset[0] + offset[1]];
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x -= camera_x;
  screen_y -= camera_y;
  screen_x /= tile_width_step_main * 2;
  screen_y /= tile_height_step_main * 2;
  screen_y += 0.5;
  return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width_step_main * 2);
  let world_y = camera_y / (tile_height_step_main * 2);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function worldOffsetToCamera([world_x, world_y]) {
  let camera_x = world_x * (tile_width_step_main * 2);
  let camera_y = world_y * (tile_height_step_main * 2);
  return new p5.Vector(camera_x, camera_y);
}

function preload() {
  if (window.p3_preload) {
    window.p3_preload();
  }
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
  let canvas = createCanvas(800, 400);
  canvas.parent("container");

  camera_offset = new p5.Vector(-width / 2, height / 2);
  camera_velocity = new p5.Vector(0, 0);

  if (window.p3_setup) {
    window.p3_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("container");

  let input = createInput("PHOENIX, AZ");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Arrow keys scroll. Clicking changes tiles.").parent("container");

  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p3_worldKeyChanged) {
    window.p3_worldKeyChanged(key);
  }
  tile_width_step_main = window.p3_tileWidth ? window.p3_tileWidth() : 32;
  tile_height_step_main = window.p3_tileHeight ? window.p3_tileHeight() : 14.5;
  tile_columns = Math.ceil(width / (tile_width_step_main * 2));
  tile_rows = Math.ceil(height / (tile_height_step_main * 2));
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  if (window.p3_tileClicked) {
    window.p3_tileClicked(world_pos[0], world_pos[1]);
  }
  return false;
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity.x += 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    camera_velocity.y -= 1;
  }
  if (keyIsDown(UP_ARROW)) {
    camera_velocity.y += 1;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.95); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }

  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );
  let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

  background(100);

  if (window.p3_drawBefore) {
    window.p3_drawBefore();
  }

  let overdraw = 0.1;

  let y0 = Math.floor((0 - overdraw) * tile_rows);
  let y1 = Math.floor((1 + overdraw) * tile_rows);
  let x0 = Math.floor((0 - overdraw) * tile_columns);
  let x1 = Math.floor((1 + overdraw) * tile_columns);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
        camera_offset.x,
        camera_offset.y
      ]); // odd row
    }
    for (let x = x0; x < x1; x++) {
      drawTile(
        tileRenderingOrder([
          x + 0.5 + world_offset.x,
          y + 0.5 - world_offset.y
        ]),
        [camera_offset.x, camera_offset.y]
      ); // even rows are offset horizontally
    }
  }

  describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

  if (window.p3_drawAfter) {
    window.p3_drawAfter();
  }
}

// Display a discription of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  push();
  translate(screen_x, screen_y);
  if (window.p3_drawSelectedTile) {
    window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  push();
  translate(0 - screen_x, screen_y);
  if (window.p3_drawTile) {
    window.p3_drawTile(world_x, world_y, -screen_x, screen_y);
  }
  pop();
}


// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}
function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 20;
}
function p3_tileHeight() {
  return 10;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];
let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function returnTileColour(i, j) {
  noStroke();

  let roadSpacing = 110; // space between roads
  let roadSize = 1; // how wide the road is

  //to create a canal
  let riverX = Math.floor(noise(j * 0.01) * 2);
  let riverY = Math.floor(noise(i * 0.01) * 2);

  let isVerticalRoad =
    Math.abs((i - Math.floor(roadSpacing / 4)) % roadSpacing) < roadSize;
  let isHorizontalRoad =
    Math.abs((j - Math.floor(roadSpacing / 2)) % roadSpacing) < roadSize;

  let roadFlag = isVerticalRoad || isHorizontalRoad;

  if (roadFlag) {
    return color(80, 80, 80); // Gray road
  } else if (Math.abs(i - riverX) <= 1) {
    return color(0, 80, random([250, 255]));
  } else if (Math.abs(j - riverY) <= 1) {
    return color(0, 80, random([250, 255]));
  } else {
    let regionI = Math.floor(i / 40);
    let regionJ = Math.floor(j / 40);

    let wField =
      4 + (XXH.h32("width seed:" + regionI + regionJ, worldSeed) % 9);
    let hField =
      4 + (XXH.h32("height seed:" + regionI + regionJ, worldSeed) % 9);

    let circlex =
      (XXH.h32("circleX:" + regionI + "," + regionJ, worldSeed) % 40) +
      regionI * 40;
    let circley =
      (XXH.h32("circleY:" + regionI + "," + regionJ, worldSeed) % 40) +
      regionJ * 40;
    let radius =
      10 + (XXH.h32("radius:" + regionI + "," + regionJ, worldSeed) % 10);

    let dx = i - circlex;
    let dy = j - circley;
    let insideCircle = dx * dx + dy * dy < radius * radius;
    let circleField = insideCircle;

    let hash = XXH.h32("Phoenix, AZ" + regionI + regionJ, worldSeed);
    let type = hash % 5;

    if (type === 0) {
      return color(80, 140, 111);
    } else if (type === 1) {
      return color(216, 184, 156);
    } else if (circleField && type === 2) {
      return color(25, 63, 55);
    } else if (circleField && type === 3) {
      return color(24, 71, 57);
    } else if (circleField && type === 4) {
      return color(197, 175, 157);
    } else if (type === 3) {
      return color(216, 184, 156);
    } else if (type === 4) {
      return color(216, 184, 156);
    } else {
      return color(174, 124, 103);
    }
  }
}

function p3_drawBefore() {}

function p3_tileClicked(i, j) {
  //get the returned color tile
  let tileColor = returnTileColour(i, j);

  //get the red, green, and blue shade
  let r = red(tileColor);
  let g = green(tileColor);
  let b = blue(tileColor);

  //determine if its the road, rocks, or river, if it is, don't make it interactable, else, make it.
  let isRoad = r === 80 && g === 80 && b === 80;
  let isRiver = r === 0 && g === 80 && (b === 250 || b === 255);
  let isRock = r === 174 && g === 124 && b === 103;
  if (!isRoad && !isRiver && !isRock) {
    let key = [i, j];
    clicks[key] = 1 + (clicks[key] | 0);
  }
}

function p3_drawTile(i, j) {
  noStroke();

  let tileColor = returnTileColour(i, j);
  fill(tileColor);

  // Draw the isometric tile
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    let numGrass = 10; // amount of grass
    let baseColor = color(100, 225, 152); // tile color

    push();
    translate(-tw / 4, -th / 4);

    for (let i = 0; i < numGrass; i++) {
      let x = random(tw);
      let grassHeight = random([10, 20, 25]) + random(-3, 3);
      let grassWidth = 1;

      //to draw the rectangles and to darken the base color slightly
      fill(lerpColor(baseColor, color(0), 0.2));
      noStroke();
      rect(x, 0, grassWidth, -grassHeight); //the negative is needed
    }
    pop();
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
