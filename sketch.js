let fxy;
let mainCanvas;
let x_axis, y_axis;
// let density = 4/1; // 2 per 1 interval (1/world unit)

let slopeInterval = 1;
let lineLength = 0.25; // in world unit
let pixelSpaceRatio = 30/1,
    minPixelRatio = 5; // 30 pixel = 1 unit space
let zoomCenter;

let drawButton;
let densitySlider, slopeLengthSlider;
let functionInput;

let mouseP = {x:null,y:null};

// user ex
let mouseDragFactor = 1 / pixelSpaceRatio,
    mouseZoomFactor = 0.001 * pixelSpaceRatio; //1/40;

// estatics
let slopeColor = "yellow"; // yellow vs black
let backGroundColor = 0; // default: 220

let axisColor = "white", numberColor = "white";

function setup() {
  resizeMainCanvas();

  background(backGroundColor);

  x_axis = {max:10, min:-10};
  y_axis = {max:10, min:-10};

  zoomCenter = {x:0, y:0};

  functionInput = document.getElementById("functionInput");
  updateSlopeFunction(functionInput.value);

  drawButton = document.getElementById("drawButton");

  slopeIntervalSlider = document.getElementById("slopeIntervalSlider");
  updateSlopeInterval(slopeIntervalSlider.value);

  slopeLengthSlider = document.getElementById("slopeLengthSlider");
  lineLength = slopeLengthSlider.value;

  window.addEventListener('resize', OnWindowResized);

  drawSlopeFieldGlobal();
}

function OnWindowResized() {
  resizeMainCanvas();
  drawSlopeFieldGlobal();
}

function resizeMainCanvas() {
  // let windowWidth = window.innerWidth,
  //     windowHeight = window.innerHeight;

  let dim = 400

  if (windowWidth < 400) {
    dim = 400;
  }
  else if (windowWidth < 800) {
    dim = Math.min(2*windowWidth/3, windowHeight);
  }
  else {
    dim = Math.min(windowWidth/2, windowHeight);
  }

  mainCanvas = createCanvas(dim, dim);
  mainCanvas.style("width", dim);
  mainCanvas.style("height", dim);

  mainCanvas.parent("main-canvas-holder");
}

function draw() {

}

function mouseWheel(event) {
  if (mouseX >=0 && mouseX <=width && mouseY >=0 && mouseY<= height) {
    //console.log(event.delta/100);

    if (pixelSpaceRatio -event.delta * mouseZoomFactor < minPixelRatio) {
      pixelSpaceRatio = minPixelRatio;
    }
    else {
      pixelSpaceRatio -= event.delta * mouseZoomFactor;
    }

    drawSlopeFieldGlobal();

    // update mouse factor for user EX
    mouseDragFactor = 1 / pixelSpaceRatio;
    mouseZoomFactor = 0.001 * pixelSpaceRatio;

    return false;
  }
  //zoom according to the vertical scroll amount
  //uncomment to block page scrolling
  //return false;
}

function mouseDragged() {
  if (mouseP.x == null || mouseP.y == null) {
    if (mouseX >=0 && mouseX <=width && mouseY >=0 && mouseY<= height) {
      mouseP.x = mouseX;
      mouseP.y = mouseY;
    }

  }
  else {
    let newX = mouseX;
    let newY = mouseY;
    zoomCenter.x += (mouseP.x - newX) * mouseDragFactor;
    zoomCenter.y += -(mouseP.y - newY) * mouseDragFactor;

    mouseP.x = newX;
    mouseP.y = newY;

    drawSlopeFieldGlobal();
  }
}

function mouseReleased() {
  mouseP = {x:null,y:null};
}



function drawSlopeField(f_slope, zoomCenter, x_limit, y_limit, slopeInterval, slopeLength, solpeColor) {
  background(backGroundColor);

  push();
  translate(width/2, height/2);
  scale(1, -1);

  translate(worldToPixel(-zoomCenter.x),
            worldToPixel(-zoomCenter.y));



  // draw slopes
  stroke(solpeColor);
  for (let i= x_limit.min; i<=x_limit.max; i += slopeInterval) {
    for (let j= y_limit.min; j<=y_limit.max; j += slopeInterval) {
      let pixelX =  worldToPixel(i),
          pixelY =  worldToPixel(j);
      let slope = f_slope(i,j);

      drawSlope(pixelX,pixelY,slope, slopeLength);
    }
  }
  // draw axis
  drawAxis({x:0,y:0}, x_limit,y_limit, 1);
  pop();
}


function drawSlopeFieldGlobal() {
  drawSlopeField(fxy, zoomCenter, x_axis, y_axis, slopeInterval, lineLength, slopeColor);
}

function worldToPixel(n) {
  return n*pixelSpaceRatio;
}

function drawSlope(x,y,m, slopeLength) {
  let pixelLength = worldToPixel(slopeLength);
  if (m == Infinity || m == -Infinity) {
    line(x,y-pixelLength/2,x, y+pixelLength/2);
  }
  else {
    let angle = Math.atan(m);
    let increment = {dx: pixelLength/2*Math.cos(angle),
                    dy: pixelLength/2*Math.sin(angle)};
    line(x-increment.dx, y-increment.dy,x+increment.dx, y+increment.dy);
  }
}

function drawAxis(origin, x_limit, y_limit, worldPadding) {
  push();
  stroke(axisColor);
  line(origin.x, worldToPixel(y_limit.min - worldPadding),
       origin.x, worldToPixel(y_limit.max + worldPadding));
  line(worldToPixel(x_limit.min - worldPadding), origin.y,
       worldToPixel(x_limit.max + worldPadding), origin.y);
  pop();
}
