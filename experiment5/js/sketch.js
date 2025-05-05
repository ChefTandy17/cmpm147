// sketch.js - create a generative art impression
// Author:Tyvin Tandy
// Date: 5/04/25

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

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;
let mutationCount = 0;

function preload() {
  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
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
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}

function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  
  fpsCounter.innerHTML = Math.round(frameRate());
}


function drawGrid(grid) {

}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function getInspirations() {
  return [
    {
      name: "Space Needle",
      assetUrl:
        "https://cdn.glitch.global/141c4a20-958e-42f5-a1ba-39a705aa6d59/SpaceNeedle?v=1746112927409",
      credit: "https://aroundtheworldwithkids.net/2022/02/07/space-needle/",
    },
    {
      name: "Horseshoe Bend",
      assetUrl:
        "https://cdn.glitch.global/141c4a20-958e-42f5-a1ba-39a705aa6d59/HorseshoeBend?v=1746122295025",
      credit: "Horseshoe Bend, Google Earth",
    },
    {
      name: "LOVE Statue",
      assetUrl:
        "https://cdn.glitch.global/141c4a20-958e-42f5-a1ba-39a705aa6d59/LoveSculpture?v=1746129030170",
      credit:
        "https://billypenn.com/2018/05/22/rip-robert-indiana-a-brief-history-of-the-love-sculpture-in-philly/",
    },
    {
      name: "Bass Pyramid",
      assetUrl:
        "https://cdn.glitch.global/141c4a20-958e-42f5-a1ba-39a705aa6d59/BassPyramid?v=1746246146315",
      credit:
        "https://www.atlantanewsfirst.com/video/2024/03/08/exploring-bass-pro-shops-pyramid-memphis/",
    },
  ];
}

function initDesign(inspiration) {
  let design = {
    bg: 128,
    fg: [],
  };

  //Space Needle with thinner boxes
  if (inspiration.name === "Space Needle") {
    resizeCanvas(inspiration.image.width / 14, inspiration.image.height / 14);
    for (let i = 0; i < 1000; i++) {
      design.fg.push({
        x: random(width),
        y: random(height),
        w: random(0.5, 5),
        h: random(height / 50000),
        fill: random(255),
      });
    }
  }

  //Horseshoe Bend with eclipses
  else if (inspiration.name === "Horseshoe Bend") {
    resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
    for (let i = 0; i < 7000; i++) {
      design.fg.push({
        x: random(width),
        y: random(height),
        w: random(50),
        h: random(50),
        fill: random(255),
      });
    }
  }

  //LOVE Sculpture with hearts and eclipses
  else if (inspiration.name === "LOVE Statue") {
    resizeCanvas(inspiration.image.width / 7, inspiration.image.height / 7);

    //for the hearts
    for (let i = 0; i < 5000; i++) {
      design.fg.push({
        x: random(width),
        y: random(height),
        size: random(width / 10000, height / 10000),
        fill: random(255),
      });
    }
  }

  //Bass Pyramid with triangles
  else if (inspiration.name === "Bass Pyramid") {
    resizeCanvas(inspiration.image.width / 8, inspiration.image.height / 6);
    for (let i = 0; i < 2500; i++) {
      design.fg.push({
        x: random(width),
        y: random(height),
        w: random(width / 500),
        h: random(height / 500),
        fill: random(255),
      });
    }
  }

  return design;
}

//this code is from Mithru in Heart Shape in p5.js
function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();

  for (let shape of design.fg) {
    fill(shape.fill, 128);

    if (inspiration.name === "Space Needle") {
      rect(shape.x, shape.y, shape.w, shape.h);
    } else if (inspiration.name === "Horseshoe Bend") {
      ellipse(shape.x, shape.y, shape.w, shape.h);
    } else if (inspiration.name === "LOVE Statue") {
      heart(shape.x, shape.y, shape.size);
    } else if (inspiration.name === "Bass Pyramid") {
      fill(shape.fill, 50);
      triangle(
        shape.x,
        shape.y,
        shape.x + random(-50,50),
        shape.y + random(-50,50),
        shape.x + random(-50,50),
        shape.y + random(-50,50)
      );
    }
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    //had to change the mutateDesign to make the hearts work
    if (inspiration.name === "LOVE Statue") {
      box.size = mut(box.size, 5, 100, rate);
    } else {
      box.w = mut(box.w, 0, width / 2, rate);
      box.h = mut(box.h, 0, height / 2, rate);
    }
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
