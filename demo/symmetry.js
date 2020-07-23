/* Copyright 2020 - Florian ARGAUD */

// radian = Nombre de points souhaité * 2
var canvas = document.getElementById("drawCanvas");

var style = canvas.style;

var getcanvas, ctx, prevX, prevY;
let symmetry = canvas.width;
let xCenter = symmetry / 2;
let radian = 8;
let brushSize = 4;
let color = "#1A202C";
let brushClick = 0;

// colors

addEventListener("load", load);
document.getElementById("red").addEventListener("click", () => {
  color = "#FC8181";
});

document.getElementById("blue").addEventListener("click", () => {
  color = "#63B3ED";
});
document.getElementById("green").addEventListener("click", () => {
  color = "#4FD1C5";
});
document.getElementById("darkgray").addEventListener("click", () => {
  color = "#1A202C";
});
document.getElementById("purple").addEventListener("click", () => {
  color = "#9F7AEA";
});
document.getElementById("eraser").addEventListener("click", () => {
  color = "#fff";
});

document.getElementById("brush").addEventListener("click", () => {
  console.log(brushClick);
  if (brushClick == 1) {
    brushSize = 8;
    brushClick = 2;
  } else if (brushClick == 2) {
    brushSize = 12;
    brushClick = 3;
  } else if (brushClick == 3) {
    brushSize = 16;
    brushClick = 4;
  } else if (brushClick == 4) {
    brushSize = 4;
    brushClick = 1;
  } else {
    brushSize = 8;
    brushClick = 2;
  }
});

document.getElementById("reset").addEventListener("click", load);

function load() {
  getcanvas = document.getElementById("drawCanvas");

  brushClick = 0;
  brushSize = 4;

  ctx = getcanvas.getContext("2d");
  ctx.clearRect(0, 0, symmetry, symmetry);

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 0.5;
  // Guides lines

  getcanvas.addEventListener("mousemove", draw);
  getcanvas.addEventListener("touchmove", draw);

  /*  */
}

function draw(e) {
  var coord = getLocalCoordinates(e);
  // console.log(" getLocalCoordinates[0] " + coord[0]);

  var x = coord[0];
  var y = coord[1];

  // (2 * Math.PI) / 16

  ctx.strokeStyle = color;
  ctx.lineWidth = brushSize;

  if (e.buttons == 1) {
    drawLine(prevX, prevY, x, y);
  } else if (e.type == "touchmove") {
    console.log(e.type == "touchmove");
    prevX = x;
    prevY = y;
    drawLine(prevX, prevY, x, y);
  }
  prevX = x;
  prevY = y;

  // console.log("Symm Y : " + prevY);
  // console.log("Symm X : " + prevX);
}

function getSymmetryPoints(x, y) {
  // The coordinate system has its origin at the center of the canvas,
  // has up as 0 degrees, right as 90 deg, down as 180 deg, and left as 270 deg.
  var ctrX = symmetry / 2;
  var ctrY = symmetry / 2;
  var relX = x - ctrX;
  var relY = ctrY - y;
  var dist = Math.hypot(relX, relY);
  var angle = Math.atan2(relX, relY); // Radians
  var result = [];
  for (var i = 0; i < radian; i++) {
    var theta = angle + ((Math.PI * 2) / radian) * i; // Radians
    x = ctrX + Math.sin(theta) * dist;
    y = ctrY - Math.cos(theta) * dist;
    result.push([x, y]);
    if (true) {
      x = ctrX - Math.sin(theta) * dist;
      result.push([x, y]);
    }
  }

  return result;
}

function drawLine(x1, y1, x2, y2) {
  startPoints = getSymmetryPoints(x1, y1);
  endPoints = getSymmetryPoints(x2, y2);

  ctx.lineWidth = brushSize;

  ctx.beginPath();
  ctx.lineCap = "round";

  for (var i = 0; i < startPoints.length; i++) {
    ctx.moveTo(startPoints[i][0], startPoints[i][1]);
    ctx.lineTo(endPoints[i][0], endPoints[i][1]);
  }
  // anti aliased ctx.translate(0.5, 0.5);

  ctx.stroke();

  ctx.stroke();
}

// Get local coor in an array
function getLocalCoordinates(ev) {
  if (ev.type == "touchmove") {
    var touch = ev.touches[0] || ev.changedTouches[0];
    var realTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    ev.offsetX = touch.clientX - realTarget.getBoundingClientRect().x;
    ev.offsetY = touch.clientY - realTarget.getBoundingClientRect().y;
  }
  return [ev.offsetX + 0.5, ev.offsetY + 0.5];
}
