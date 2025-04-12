// sketch.js - purpose and description here
// Author: Your Name
// Date:

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

//variable colors
const lakeColor = "#a1c1c9";
const skyColor = "#7bbffa";
const cloudColor = "#e8f0f3";
const mountainColorFirstLayer = "#6a7b46";
const mountainColorSecondLayer = "#53642b";
const mountainColorThirdLayer = "#bab8c1";
const treeColor = "#3d5230";

//global variables for the clouds and trees
let clouds = [];
let trees = [];

//global variables for the shimmer
let shimmerYOffsets = [300, 350, 400];  //positioned that its on the lake
let shimmerSpeed = [0.3, 0.5, 0.7];    //slow shimmer speeds


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
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");


  // resize canvas is the page is resized
  //createCanvas(1000, 500);
  //to set up the clouds and the array
  for (let i = 0; i < random(2, 8); i++) {
    clouds.push({
      x: random(-200, width),
      y: random(height / 10, height / 3),
      speed: random(0.5, 2),
      size: random(0.5, 1.2),
    });
  }

  //to set up the trees
  let numTrees = random(10, 30); //amount of trees
  for (let i = 0; i < numTrees; i++) {
    //randomly place the trees
    let x = random(0, width);
    //this is similar noise function for the mountain second layer
    let noiseOffset = map(x, 0, width, 0, 8);
    let distanceFromCenter = abs(x - width / 2);
    let valley = pow(distanceFromCenter / (width / 2), 1.5);
    let y =
      height / 2 - noise(noiseOffset) * height * 0.3 * valley - height / 550;

    //push it in the array
    trees.push({ x, y });
  }

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  //this is needed to prevent outlines
  noStroke();

  //to draw the sky
  fill(skyColor);
  rect(0, 0, width, height / 2);

  //to move and draw the cloud
  fill(cloudColor);
  for (let cloud of clouds) {
    cloud.x += cloud.speed;
    //reset the cloud if goes offscreen
    if (cloud.x > width + 200) {
      cloud.x = -200;
      cloud.y = random(height / 10, height / 3); //to reset to a differernt location
      cloud.speed = random(0.2, 1); //to reset to a different speed
      cloud.size = random(0.5, 1.5); //to reset to a different size
    }
    push(); //save the cloud
    translate(cloud.x, cloud.y); //move the position of the clouds
    scale(cloud.size); //size of the clouds
    //to make it look like a cloud
    ellipse(0, 0, 180, 80);
    ellipse(-50, 10, 120, 60);
    ellipse(50, 10, 140, 60);
    pop(); //reset it
  }

  //first layer of the mountain, which will be gray
  fill(mountainColorThirdLayer);
  beginShape();

  //the highest point possible
  vertex(0, height);

  //to set up the noise variables
  let noisePositionFirst = 0;
  let noiseStepFirst = 0.1;
  let stepsFirst = 30;

  //to draw the noise
  for (let i = 0; i <= stepsFirst; i++) {
    let x = (width * i) / stepsFirst;
    let y =
      height / 2 - (noise(noisePositionFirst) * height * 0.22 * height) / 250;

    vertex(x, y);
    noisePositionFirst += noiseStepFirst;
  }

  vertex(width, height / 2);
  endShape(CLOSE);

  //second layer of the mountain
  fill(mountainColorSecondLayer);
  beginShape();
  vertex(0, height / 2);

  let noisePositionSecond = 0;
  let noiseStepSecond = 0.1;
  let stepsSecond = 80;

  for (let i = 0; i <= stepsSecond; i++) {
    let x = (width * i) / stepsSecond;

    let y =
      height / 2 - (noise(noisePositionSecond) * height * 0.3 * height) / 350;

    vertex(x, y);
    noisePositionSecond += noiseStepSecond;
  }

  vertex(width, height / 2);
  endShape(CLOSE);

  //third layer of the mountain
  fill(mountainColorFirstLayer);
  beginShape();
  vertex(0, height / 2);

  let noisePositionThird = 1;
  let noiseStepThird = 0.1;
  let stepsThird = 80;

  for (let i = 0; i <= stepsThird; i++) {
    let x = (width * i) / stepsThird;

    //to create a dip in the mountain
    let distanceFromCenter = abs(x - width / 1.6);
    let valley = pow(distanceFromCenter / (width / 2), 1.5);

    let y =
      height / 2 -
      noise(noisePositionThird) * height * 0.3 * valley -
      height / 550;

    vertex(x, y);
    noisePositionThird += noiseStepThird;
  }

  vertex(width, height / 2);
  endShape(CLOSE);

  //to create a tree
  fill(treeColor); // dark greenish color for trees
  for (let i = 0; i < trees.length; i++) {
    let tree = trees[i];
    let treeHeight = 15;
    let treeWidth = treeHeight / 2;
    triangle(
      //polygon
      tree.x,
      tree.y - treeHeight,
      tree.x - treeWidth / 2,
      tree.y,
      tree.x + treeWidth / 2,
      tree.y
    );
  }

  //to draw a lake
  fill(lakeColor);
  rect(0, height / 2, width, height / 2);

  //to make it shimmer-like in the lake
  for (let i = 1; i < 3; i++) {
    let space = width / 4;
    let x = space + i * space;
    shimmerYOffsets[i] += shimmerSpeed[i];
    //to detect it its moving too high or too low to move it down
    if (shimmerYOffsets[i] > height - 50 || shimmerYOffsets[i] < height / 1.7) {
      shimmerSpeed[i] *= -1;    //to move it down or up
    }
    
    //to create the eclipse
    fill(100, 200, 255, 80);
    ellipse(x, shimmerYOffsets[i], 800, 30);
  }
/*
  background(220);    
  // call a method on the instance
  myInstance.myMethod();

  // Set up rotation for the rectangle
  push(); // Save the current drawing context
  translate(centerHorz, centerVert); // Move the origin to the rectangle's center
  rotate(frameCount / 100.0); // Rotate by frameCount to animate the rotation
  fill(234, 31, 81);
  noStroke();
  rect(-125, -125, 250, 250); // Draw the rectangle centered on the new origin
  pop(); // Restore the original drawing context

  // The text is not affected by the translate and rotate
  fill(255);
  textStyle(BOLD);
  textSize(140);
  text("p5*", centerHorz - 105, centerVert + 40);
*/
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}