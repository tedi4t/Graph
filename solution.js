'use strict';

//console.time('experiment');
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("myCanvas2");
const ctx2 = canvas2.getContext("2d");

const cofSmaller = 0.94;
const cofBigger = 0.42;

document.getElementById('direction').addEventListener('click', changeDirection, null);
document.getElementById('2Lab').addEventListener('click', getSecondLab, null);

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

if (windowWidth < 450) {
  canvas.width = windowWidth * cofSmaller;
  canvas.height = canvas.width;
  canvas2.width = windowWidth * cofSmaller;
  canvas2.height = canvas.width;
} else {
  canvas.width = windowWidth * cofBigger;
  canvas.height = canvas.width;
  canvas2.width = windowWidth * cofBigger;
  canvas2.height = canvas.width;
}

if (windowWidth < 600) {
  canvas.width = windowWidth * 0.92;
  canvas.height = canvas.width;
  canvas2.width = windowWidth * 0.92;
  canvas2.height = canvas2.width;
}

const height = canvas.height;
const width = canvas.width;
console.log({ wH: windowHeight, wW: windowWidth, height: canvas.height, width: canvas.width });

const n = 12; //amount of points
const mainX = width / 2; //building graphs
const mainY = height / 2; //building graphs
const mainRadius = height * 0.4; //building graphs
const ballRadius = mainRadius * 0.1;
const alpha = 2 * Math.PI / (n - 1); // building graphs
const digitColor = '#0e014b';
const ballColor = '#36bddd';
const distanceFromCentre =  1.25 * ballRadius;
const seed = 9327; // taken from the condition of the problem
const points = []; //Array of poins
const letterSize = ballRadius * 0.4;
let directed = true;

ctx.textBaseline = 'middle';
ctx.textAlign = 'center';
ctx.font = `15px Times New Roman`;


const A = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
];


/*
second lab
const A = [

  [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
  [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
  [1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
];
 */

class Connections {
  constructor() {
    this.betha = Math.PI / 12; //angle for arrow's head
    this.arrowLenth = ballRadius * 0.8; //connections
    this.angleEachOther = Math.PI / 14; //connections
    this.arrowColor = '#dd0300';
  }

  connectPoints (point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.closePath();
    ctx.stroke();
  }

  findRight(context, from, to, radius, angle) {
    const {point1, point2} = this.findCoordinates(from, to);
    const x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
    const alpha = -Math.atan((y2 - y1) / (x2 - x1));
    const delta = alpha - angle;
    const halfDistance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2;
    let c = halfDistance / Math.cos(angle);
    if (x1 > x2) c = -c;
    const x3 = x1 + c * Math.cos(delta);
    const y3 = y1 - c * Math.sin(delta);
    const point3 = {x: x3, y: y3};
    return point3;
  }


  findLeft(context, from, to, radius, angle) {
    const {point1, point2} = this.findCoordinates(from, to);
    const x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
    const alpha = -Math.atan((y2 - y1) / (x2 - x1));
    const halfDistance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2;
    let c = halfDistance / Math.cos(angle);
    if (x1 > x2) c = -c;
    const betha = (Math.PI / 2) - alpha - angle;
    const x4 = x1 + c * Math.sin(betha);
    const y4 = y1 - c * Math.cos(betha);
    const point4 = {x: x4, y: y4};
    return point4;
  }

  findDistance(x1, y1, x2, y2, x3, y3) {
    const a = y2 - y1;
    const b = x1 - x2;
    const c = y1 * (x2 - x1) - x1 * (y2 - y1);
    const d = Math.abs(a * x3 + b * y3 + c) / Math.sqrt(a * a + b * b);
    return d;
  }

  crossesBall(graphs, from, to, point3, bR) {
    const {point1, point2} = this.findCoordinates(from, to);
    let xMin = Math.min(point1.x, point3.x) - bR;
    let xMax = Math.max(point1.x, point3.x) + bR;
    let yMin = Math.min(point1.y, point3.y) - bR;
    let yMax = Math.max(point1.y, point3.y) + bR;

    const isInside = (graph, xMin, xMax, yMin, yMax, from, to) =>
      (graph.x < xMax && graph.x > xMin && graph.y < yMax && graph.y > yMin && graph.index !== from.index && graph.index !== to.index);

    for (const graph of graphs) {
      if (isInside(graph, xMin, xMax, yMin, yMax, from, to)) {
        //console.log(graph);
        let x1 = point1.x;
        let y1 = point1.y;
        const x2 = point3.x;
        const y2 = point3.y;
        const x3 = graph.x;
        const y3 = graph.y;
        let d = this.findDistance(x1, y1, x2, y2, x3, y3);
        if (d < bR) return true;
      }
    }

    xMin = Math.min(point2.x, point3.x) - bR;
    xMax = Math.max(point2.x, point3.x) + bR;
    yMin = Math.min(point2.y, point3.y) - bR;
    yMax = Math.max(point2.y, point3.y) + bR;

    for (const graph of graphs) {
      if (isInside(graph, xMin, xMax, yMin, yMax, from, to)) {
        //console.log(graph);
        let x1 = point2.x;
        let y1 = point2.y;
        const x2 = point3.x;
        const y2 = point3.y;
        const x3 = graph.x;
        const y3 = graph.y;
        let d = this.findDistance(x1, y1, x2, y2, x3, y3);
        if (d < bR) return true;
      }
    }

    return false;
  }

  drawSideLine(context, from, to, point3, radius) {
    const {point1, point2} = this.findCoordinates(point3, from);
    this.connectPoints(from, point3);
    this.connectPoints(point3, to);
    this.drawArrowhead(context, point3, point2, radius);
  }

  connectEachOther(context, from, to, angle = this.angleEachOther, radius = this.arrowLenth) {
    const {point1, point2} = this.findCoordinates(from, to);
    this.drawArrowedLine(context, from, to, radius);
    let point3 = this.findRight(context, from, to, radius, angle);

    if (!this.crossesBall(points, point1, point2, point3, ballRadius))
      this.drawSideLine(context, from, to, point3, radius);
    else {
      point3 = this.findLeft(context, from, to, radius, angle);
      this.drawSideLine(context, from, to, point3, radius);
    }
  }

  findCoordinates(from, to) {
    let xCentre, yCentre;
    let angle = Math.atan((to.y - from.y) / (to.x - from.x));

    if (to.x < from.x) {
      xCentre = to.x + ballRadius * Math.cos(angle);
      yCentre = to.y + ballRadius * Math.sin(angle);
    } else {
      xCentre = to.x - ballRadius * Math.cos(angle);
      yCentre = to.y - ballRadius * Math.sin(angle);
    }

    let xCentre1, yCentre1;
    angle = Math.atan((to.y - from.y) / (to.x - from.x));
    if (to.x < from.x) {
      xCentre1 = from.x - ballRadius * Math.cos(angle);
      yCentre1 = from.y - ballRadius * Math.sin(angle);
    } else {
      xCentre1 = from.x + ballRadius * Math.cos(angle);
      yCentre1 = from.y + ballRadius * Math.sin(angle);
    }
    const point1 = {x: xCentre1, y: yCentre1};
    const point2 = {x: xCentre, y: yCentre};
    return ({point1, point2});
  }

  drawArrowhead(context, from, to, radius) {

    let xCentre, yCentre;
    let angle = Math.atan((to.y - from.y) / (to.x - from.x));

    if (to.x >= from.x) radius = -radius;

    xCentre = to.x;
    yCentre = to.y;

    context.beginPath();
    ctx.fillStyle = this.arrowColor;
    context.moveTo(xCentre, yCentre);

    let gamma = ((Math.PI / 2) - angle - this.betha);
    let x = xCentre + radius * Math.sin(gamma);
    let y = yCentre + radius * Math.cos(gamma);

    context.lineTo(x, y);

    gamma = (angle - this.betha);

    x = xCentre + radius * Math.cos(gamma);
    y = yCentre + radius * Math.sin(gamma);

    context.lineTo(x, y);

    context.closePath();

    context.fill();
  }

  inItself(context, point, ballRadius) {
    const centre = { x: mainX, y: mainY };
    let firstPoint = false;
    if (point.x === centre.x && point.y === centre.y){
      point = points[1];
      firstPoint = true;
    }
    let angle = - Math.atan((point.y - centre.y) / (point.x - centre.x));
    let sqrt2 = Math.sqrt(2);
    let alpha = -angle - Math.PI / 4;
    let betha = (-angle + Math.PI / 4);
    if (point.x >= centre.x) {
      alpha +=  Math.PI;
      betha -= Math.PI;
      sqrt2 = -sqrt2;
    }
    const x = point.x - sqrt2*ballRadius*Math.cos(angle);
    let y = point.y + sqrt2*ballRadius*Math.sin(angle);
    if (firstPoint) y += points[0].y - points[1].y;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, alpha, betha, true);
    ctx.stroke();
    ctx.closePath();
  }

  inItselfDirected(context, point, ballRadius) {
    this.inItself(context, point, ballRadius);
    const centre = { x: mainX, y: mainY };
    const angle = - Math.atan((point.y - centre.y) / (point.x - centre.x));
    const gamma = angle - Math.PI / 4;
    if (point.x < centre.x) ballRadius = - ballRadius;
    const x1 = point.x + ballRadius*Math.cos(gamma);
    const y1 = point.y - ballRadius*Math.sin(gamma);
    const point2 = {x: x1, y: y1};
    this.drawArrowhead(context, point, point2, -this.arrowLenth);
  }

  drawArrowedLine (context, from, to, radius = this.arrowLenth) {
    const {point1, point2} = this.findCoordinates(from, to);
    this.connectPoints(point1, point2);
    this.drawArrowhead(context, point1, point2, radius);
  };
}

class SecondLab {
  constructor(A) {
    this.A = A;
  }

  edgesOutside(A) {
    const outside = [];
    for (const index in A) {
      outside[index] = A[index].reduce((acc, val) => acc + val);
    }
    return outside;
  }

  edgesInside(A) {
    const inside = [];
    for (let index = 0; index < n; index++) {
      const insidePoint = [];
      for (let j = 0; j < n; j++) {
        insidePoint.push(A[j][index]);
      }
      inside[index] = insidePoint.reduce((acc, val) => acc + val);
    }
    return inside;
  }

  findPointsPower(A) {
    const inside = this.edgesInside(A);
    const outside = this.edgesOutside(A);
    const power = [];
    for (const index in inside) {
      power[index] = inside[index] + outside[index];
    }
    return power;
  }

  findSystemPower(A) {
    const pointsPower = this.findPointsPower(A);
    if (pointsPower.filter(item => item === pointsPower[0]).length === pointsPower.length)
      return pointsPower[0];
  }

  handingPoints(A) {
    const B = convertInUndirected(clone(A));
    const power = this.findPointsPower(B).filter(item => item === 1);
    return power;
  }

  notConnected(A) {
    const inside = this.edgesInside(A);
    const outside = this.edgesOutside(A);
    const power = [];
    for (let i = 0; i < n; i++){
      power[i] = inside[i] + outside[i];
    }
    const notConnected = [];
    for (let i = 0; i < n; i++) {
      if (power[i] === 0)
        notConnected.push(i + 1);
    }
    return notConnected;
  }

  getResults() {
    const inside = this.edgesInside(this.A);
    const outside = this.edgesOutside(this.A);
    const power = this.findPointsPower(this.A);
    const handing = this.handingPoints(this.A);
    const isolated = this.notConnected(this.A);
    const systemPower = this.findSystemPower(this.A);

    const results = [];

    results.push(`points\' degrees inside and outside`);
    for (const index in inside) {
      results.push(`point ${parseInt(index) + 1}: inside: ${inside[index]}, outside: ${outside[index]}`);
    }
    results.push(`points\' degrees`);

    for (const index in power) {
      results.push(`point ${parseInt(index) + 1}: degree: ${power[index]}`);
    }

    results.push(handing.length ? `handing points: ${handing}`: `No handing points`);
    results.push(isolated.length ? `isolated points: ${isolated}` : `No isolated points`);
    results.push(systemPower ? `system's power is ${systemPower}` : `No system power`);
    return results;
  }

}

function changeDirection() {
  if (directed) {
    buildOnArrDirected();
    directed = false;
  } else {
    buildOnArr();
    directed = true;
  }
}

const buildCircle = (point, radius, fillStyle) => {
  let { index, x, y } = point;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.fillStyle = digitColor;
  if (index >= 0) {
    if (index >= 9)
      x -= 2.5;
    ctx.fillText(index + 1, x, y);
  }
  ctx.closePath();
};

const buildGraphs = (alpha) => {
  let angle = 0;
  const color = ballColor;
  const point = {index: 0, x: mainX, y: mainY}
  buildCircle(point, ballRadius, color);
  points.push({index: 0, x: mainX, y: mainY});
  for (let index = 1; index < n; index++) {
    const x = mainX - (mainRadius * Math.sin(angle));
    const y = mainY - (mainRadius * Math.cos(angle));
    const point = {index, x, y};
    points.push(point);
    buildCircle(point, ballRadius, color);
    angle += alpha;
  }
};


function buildOnArrDirected() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const connections = new Connections();
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (A[i][j] === 1) {
        if (i === j) connections.inItselfDirected(ctx, points[i], ballRadius);
        else if (A[j][i] === 1) {
          if ((i > j)) {
            connections.connectEachOther(ctx, points[i], points[j]);
          }
        } else
          connections.drawArrowedLine(ctx, points[i], points[j]);
      }
    }
  }
  buildGraphs(alpha);
}

function buildOnArr() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const connections = new Connections();
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (A[i][j] === 1) {
        if (i === j) connections.inItself(ctx, points[i], ballRadius);
        else
          connections.connectPoints(points[i], points[j]);
      }
    }
  }
  buildGraphs(alpha);
}

buildGraphs(alpha);

buildOnArrDirected(A);

/*
- степені усіх вершин ненапрямленого графу - кількість пов'язаних з вершиною ребер
- напівстепені виходу(кількість ребер що виходять) та заходу(кількість ребер що входять) напрямленого графу
- якщо однорідний( всі степені однакові), то вказати степінь однорідності графу
- всі висячі вершини - степінь 1
- всі ізольовані вершини - вершини які ні з ким не з'єднані
 */


function clone(A) {
  const B = [];
  for (let i = 0; i < n; i++) {
    B[i] = [...A[i]];
  }
  return B;
}

function convertInUndirected(A) {
  const B = clone(A);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (B[i][j] == 1)
        B[j][i] = 1;
    }
  }
  return B;
}

function displayText(text) {
  let startX = 10;
  let startY = 15;
  let distance;
  if (windowWidth < 1000) {
    console.log('smaller');
    canvas2.height = 12 * text.length + 30;
    ctx2.font = '10px Arial, serif';
    distance = 12;
  } else {
    ctx2.font = '14px Arial, serif';
    distance = 16;
  }
  for (const str of text) {
    ctx2.fillText(str, startX, startY);
    startY += distance;
  }
}

function getSecondLab() {
  const secondLab = new SecondLab(A);
  const results = secondLab.getResults();
  displayText(results);
}

//console.log(B);

//console.timeEnd('experiment');

/*
[
  [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
  [0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1]
]
 */
