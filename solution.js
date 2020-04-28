'use strict';

//console.time('experiment');
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("myCanvas2");
const ctx2 = canvas2.getContext("2d");

let fourthLabCalledInd = 0, fifthLabCalledInd = 0, sixLabCalledInd = 0;
const cofSmaller = 0.94;
const cofBigger = 0.42;

document.getElementById('direction').addEventListener('click', changeDirection, null);
document.getElementById('2Lab').addEventListener('click', getSecondLab, null);
document.getElementById('3Lab').addEventListener('click', getThirdLab, null);
document.getElementById('4Lab').addEventListener('click', getFourthLab, null);
document.getElementById('5Lab').addEventListener('click', getFifthLab, null);
document.getElementById('6Lab').addEventListener('click', getSixthLab, null);
document.getElementById('clear').addEventListener('click', clear, null);

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

if (windowWidth < 450) {
  canvas.width = windowWidth * cofSmaller - 2;
  canvas.height = canvas.width;
  canvas2.width = windowWidth * cofSmaller - 2;
  canvas2.height = canvas.width;
} else {
  canvas.width = windowWidth * cofBigger - 2;
  canvas.height = canvas.width;
  canvas2.width = windowWidth * cofBigger - 2;
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
// console.log({ wH: windowHeight, wW: windowWidth, height: canvas.height, width: canvas.width });

const n = 12; //amount of points
const mainX = width / 2; //building graphs
const mainY = height / 2; //building graphs
const mainRadius = height * 0.4; //building graphs
const ballRadius = mainRadius * 0.1;
const alpha = 2 * Math.PI / (n - 1); // building graphs
const digitColor = '#0e014b';
const ballColor = '#36bddd', activeColor = '#dd0008', visitedColor = '#80dd47';
const distanceFromCentre =  1.25 * ballRadius;
const imiginary_weight = 99999999;
const seed = 9327; // taken from the condition of the problem
// const points = []; //Array of poins
const letterSize = ballRadius * 0.4;
let directed = false;

ctx.textBaseline = 'middle';
ctx.textAlign = 'center';
ctx.font = `15px Times New Roman`;

ctx2.textBaseline = 'middle';
ctx2.textAlign = 'center';
ctx2.font = `25px sans-serif`;

const A = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
];

// const A = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

const weights = [
  [99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 22, 99999999, 99999999, 99999999, 99999999],
  [24, 99999999, 5, 99999999, 41, 99999999, 99999999, 10, 99999999, 99999999, 99999999, 2],
  [99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 36],
  [18, 99999999, 99999999, 99999999, 99999999, 41, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999],
  [99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 2, 39, 99999999, 26, 99999999, 99999999],
  [99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999],
  [99999999, 99999999, 99999999, 99999999, 15, 24, 99999999, 28, 27, 44, 99999999, 99999999],
  [26, 99999999, 99999999, 99999999, 8, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999],
  [99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999],
  [99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 22, 99999999, 99999999, 99999999, 21, 99999999],
  [99999999, 99999999, 99999999, 41, 49, 5, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999],
  [99999999, 99999999, 99999999, 6, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999, 99999999],
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
  constructor(ballRadius) {
    this.betha = Math.PI / 12; //angle for arrow's head
    this.arrowLenth = ballRadius * 0.8; //connections
    this.angleEachOther = Math.PI / 14; //connections
    this.arrowColor = '#dd0300';
    this.ballRadius = ballRadius;
  }

  connectPoints (context, point1, point2) {
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.closePath();
    context.stroke();
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
    // console.log({from, to});
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
    this.connectPoints(context, from, point3);
    this.connectPoints(context, point3, to);
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
    return point3;
  }

  findCoordinates(from, to) {
    let xCentre, yCentre;
    // console.log({from ,to});
    let angle = Math.atan((to.y - from.y) / (to.x - from.x));

    if (to.x < from.x) {
      xCentre = to.x + this.ballRadius * Math.cos(angle);
      yCentre = to.y + this.ballRadius * Math.sin(angle);
    } else {
      xCentre = to.x - this.ballRadius * Math.cos(angle);
      yCentre = to.y - this.ballRadius * Math.sin(angle);
    }

    let xCentre1, yCentre1;
    angle = Math.atan((to.y - from.y) / (to.x - from.x));
    if (to.x < from.x) {
      xCentre1 = from.x - this.ballRadius * Math.cos(angle);
      yCentre1 = from.y - this.ballRadius * Math.sin(angle);
    } else {
      xCentre1 = from.x + this.ballRadius * Math.cos(angle);
      yCentre1 = from.y + this.ballRadius * Math.sin(angle);
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
    context.fillStyle = this.arrowColor;
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
    context.beginPath();
    context.arc(x, y, ballRadius, alpha, betha, true);
    context.stroke();
    context.closePath();
    return {x, y};
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
    // console.clear();
    // console.log({from, to});
    const {point1, point2} = this.findCoordinates(from, to);
    this.connectPoints(context, point1, point2);
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

class ThirdLab {
  constructor(A) {
    this.A = A;
  }

  TransformInDirectionsFromPoint() {
    this.directions = [];
    for (const i in this.A) {
      this.directions[i] = [];
      const arr = this.A[i];
      for (const j in arr) {
        if (arr[j] === 1 && i !== j)
          this.directions[i].push(j);
      }
    }
    // console.log(this.directions);
  }

  findWay(length) {
    if (!this.directions)
      this.TransformInDirectionsFromPoint();
    let lenghtWays = [];
    for (let i = 0; i < this.A.length; i++)
      lenghtWays.push([i]);
    for (let counter = 0; counter < length; counter++) {
      for (const prevPoints of lenghtWays) {
        const lastPoint = prevPoints[prevPoints.length - 1];
        const nextPoints = this.directions[lastPoint];
        for (const nextPoint of nextPoints) {
          lenghtWays.push([...prevPoints, nextPoint]);
        }
        lenghtWays = lenghtWays.filter(item => item.length === counter + 2);
      }
    }
    return lenghtWays.map(arr => arr.map(item => parseInt(item) + 1));
  }

  findWayWithExcludeRepeating(length) {
    const ways = this.findWay(length);
    for (const index in ways) {
      const arr = ways[index];
      for (let i = 0; i < 4; i++) {
        const item1 = arr[i];
        const item2 = arr[i + 1];
        const item3 = arr[i + 2];
        const item4 = arr[i + 3];
        if (item1 === item3 && item2 === item4)
          ways.splice(index, 1);
      }
    }
    // console.log(ways);
    return ways;
  }

  findProduct(matrix1, matrix2) {
    const len = matrix1.length;

    const product = [];
    for (let i = 0; i < len; i++)
      product[i] = [];

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        product[i][j] = 0;
        for (let changing = 0; changing < len; changing++) {
          product[i][j] += matrix1[i][changing] * matrix2[changing][j];
        }
      }
    }
    return product;
  }

  findMatrixInPower(matrix, power) {
    let product = matrix;
    for (let i = 0; i < power - 1; i++) {
      product = this.findProduct(product, matrix);
    }
    return product;
  }

  uniteMatrix(matrix1, matrix2) {
    const len = matrix1.length;
    const united = [];
    for (let i = 0; i < len; i++) {
      united[i] = [];
      for (let j = 0; j < len; j++) {
        if (matrix1[i][j] === 1 || matrix2[i][j] === 1)
          united[i][j] = 1; else united[i][j] = 0;
      }
    }
    return united;
  }

  transponateMatrix(matrix) {
    const transponated = [];
    const len = matrix.length;
    for (let i = 0; i < len; i++) {
      transponated[i] = [];
      for (let j = 0; j < len; j++) {
        transponated[i][j] = matrix[j][i];
      }
    }
    return transponated;
  }

  reachabilityMatrix(matrix) {
    let reached = [];
    const len = matrix.length;
    for (let i = 0; i < len; i++) {
      reached[i] = [];
      for (let j = 0; j < len; j++)
        (i === j) ? reached[i][j] = 1 : reached[i][j] = 0;
    }
    reached = this.uniteMatrix(reached, matrix);
    for (let i = 0; i < len - 1; i++) {
      reached = this.uniteMatrix(reached, this.findMatrixInPower(matrix, i + 1));
    }
    return reached;
  }

  connectivityMatrix(matrix) {
    const reached = this.reachabilityMatrix(matrix);
    const transponated = this.transponateMatrix(reached);
    const len = matrix.length;
    const connective = [];
    for (let i = 0; i < len; i++) {
      connective[i] = [];
      for (let j = 0; j < len; j++)
        connective[i][j] = reached[i][j] * transponated[i][j];
    }
    return connective;
  }

  findPossibleDirectionsInConnectivity(matrix) {
    const connectiveMatrix = this.connectivityMatrix(matrix);
    const directions = [];
    const len = connectiveMatrix.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (connectiveMatrix[i][j] === 1)
          directions.push([i, j]);
      }
    }
    return directions.sort((a, b) => a[0] - b[0]);
  }

  // sortByFirstElement(directions) {
  //   const sortedDirections = [];
  //   for (const arr of directions) {
  //     const index = arr[0];
  //     sortedDirections[index] = arr;
  //   }
  //   return sortedDirections;
  // }

  pointIsIncluded (arr, point) {
    return (arr.filter(item => item == point).length > 0);
  }

  includes(dirs, item) {
    for (const arr of dirs) {
      if (arr[0] == item[0] && arr[1] == item[1])
        return true;
    }
    return false;
  }

  findComponentas(matrix) {
    const directions = this.findPossibleDirectionsInConnectivity(matrix);
    // console.log(directions);
    const pointsLeft = [];
    for (const pointNumber in matrix)
      pointsLeft.push(parseInt(pointNumber));
    const componentas = [];
    // console.log(pointsLeft);
    while(pointsLeft.length > 0) {
      const pointsOfBlock = [pointsLeft[0]];
      let added = true;
      while (added) {
        added = false;
        for (const checkingPoint of pointsLeft) {
          if (!added && !this.pointIsIncluded(pointsOfBlock, checkingPoint)) {
            let suitable = true;
            for (const blockPoint of pointsOfBlock) {
              const condition = (this.includes(directions, [checkingPoint, blockPoint]) && this.includes(directions, [checkingPoint, blockPoint]));
              // console.log({pointsOfBlock, dir: [checkingPoint, blockPoint], condition});
              if (!condition)
                suitable = false;
            }
            if (suitable) {
              pointsOfBlock.push(checkingPoint);
              added = true;
            }
          }
        }
        // console.log({pointsOfBlock, pointsLeft, added});
        if (!added) {
          componentas.push(pointsOfBlock);
          for (const point of pointsOfBlock) {
            pointsLeft.splice(pointsLeft.indexOf(point), 1);
          }
        }
      }
    }

    return componentas;
  }

  buildCondensationMatrix(matrix) {
    const componentas = this.findComponentas(matrix);
    const len = componentas.length;
    const condensationMatrix = [];
    for (let i = 0; i < len; i++) {
      condensationMatrix[i] = [];
      for (let j = 0; j < len; j++)
        condensationMatrix[i][j] = 0;
    }
    for (const curCondensInd in componentas) {
      for (let checkingInd = curCondensInd; checkingInd < len; checkingInd ++) {
        let connected = false;
        for (const firstComponentaPoint of componentas[curCondensInd]) {
          for (const secondComponentaPoint of componentas[checkingInd]) {
            if (!connected && curCondensInd !== checkingInd) {
              if (matrix[firstComponentaPoint][secondComponentaPoint] === 1) {
                condensationMatrix[curCondensInd][checkingInd] = 1;
                connected = true;
              } else if (matrix[secondComponentaPoint][firstComponentaPoint] === 1) {
                condensationMatrix[checkingInd][curCondensInd] = 1;
                connected = true;
              }
            }
          }
        }
      }
    }
    return condensationMatrix;
  }

  buildCondensationGraph(matrix, startY) {
    let angle = 0;
    const condensationMatrix = this.buildCondensationMatrix(matrix);
    const radius = mainRadius;
    const newBallRadius = (ballRadius);
    const alpha = 2 * Math.PI / condensationMatrix.length;
    const centreX = canvas2.width / 2;
    const centreY = startY + radius * 1.2;
    const points = [];
    for (let index = 0; index < condensationMatrix.length; index++) {
      const x = centreX - (radius * Math.sin(angle));
      const y = centreY - (radius * Math.cos(angle));
      const point = {index, x, y};
      points.push(point);
      // buildCircle(ctx2, point, newBallRadius, ballColor);
      angle += alpha;
    }
    buildOnArrDirected(ctx2, condensationMatrix, points, ballRadius);
    // console.log({radius, centreX, centreY, points});
  }

  getResults() {
    const secondLab = new SecondLab(this.A);
    const inside = secondLab.edgesInside(this.A);
    const outside = secondLab.edgesOutside(this.A);
    const waysTwoLength = this.findWay(2);
    const waysThreeLength = this.findWay(3);
    const reachabilityMatrix = this.reachabilityMatrix(this.A);
    const connectivityMatrix = this.connectivityMatrix(this.A);
    const componentas = this.findComponentas(this.A);
    // console.log(componentas);

    const results = [];

    results.push(`The adjacency matrix`);
    for (let arr of this.A)
      results.push(`[${arr}]`);

    results.push(``);

    results.push(`points\' degrees inside and outside`);
    for (const index in inside) {
      results.push(`point ${parseInt(index) + 1}: inside: ${inside[index]}, outside: ${outside[index]}`);
    }

    results.push(``);

    results.push(`Ways of length 2`);

    for (let index = 0; index < waysTwoLength.length;) {
      if (waysTwoLength[index + 1] && waysTwoLength[index + 2])
        results.push(`[${waysTwoLength[index]}], [${waysTwoLength[index + 1]}], [${waysTwoLength[index + 2]}]`);
      else if (waysTwoLength[index + 1])
        results.push(`[${waysTwoLength[index]}], [${waysTwoLength[index + 1]}]`);
          else results.push(`[${waysTwoLength[index]}]`);
      index += 3;
    }

    results.push(``);

    results.push(`Ways of length 3`);

    for (let index = 0; index < waysThreeLength.length;) {
      if (waysThreeLength[index + 1] && waysThreeLength[index + 2])
        results.push(`[${waysThreeLength[index]}], [${waysThreeLength[index + 1]}], [${waysThreeLength[index + 2]}]`);
      else if (waysThreeLength[index + 1])
        results.push(`[${waysThreeLength[index]}], [${waysThreeLength[index + 1]}]`);
      else results.push(`[${waysThreeLength[index]}]`);
      index += 3;
    }

    results.push(``);

    results.push(`reachability matrix`);

    for (const arr of reachabilityMatrix) {
      results.push(`[${arr}]`);
    }

    results.push(``);

    results.push(`connectivity Matrix`);

    for (const arr of connectivityMatrix) {
      results.push(`[${arr}]`);
    }

    results.push(``);

    results.push(`Componentas`);

    for (let index = 0; index < componentas.length; index++)
      results.push(`[${componentas[index]}]`);

    return results;
  }

  displayResults() {
    const results = this.getResults();
    // console.log(results);
    let positionY;
    if (windowWidth < 1000)
      positionY = 14 * results.length;
    else positionY = 16 * results.length;
    displayText(ctx2, results, mainRadius * 2.5);

    this.buildCondensationGraph(this.A, positionY);
  }
}

class FourthLab {
  constructor(A, ind) {
    this.A = A;
    this.unvisitedColor = '#36bddd';
    this.activeColor = '#dd0008';
    this.visitedColor = '#80dd47';
    this.calledInd = ind;
  }

  generateStepColors(visited, unvisited, active) {
    const colors = [];
    visited.map(point => colors[point] = this.visitedColor);
    unvisited.map(point => colors[point] = this.unvisitedColor);
    colors[active] = this.activeColor;
    return colors;
  }

  getRectMatrix(n) {
    const A = [];
    for (let i = 0; i < n; i++) {
      A.push([]);
      for (let j = 0; j < n; j++)
        A[i][j] = 0;
    }
    return A;
  }

  getStepsAndColors(matrix = this.A) {
    const unvisited = matrix.map((val, index) => index);
    const steps = [], colorSteps = [], visited = [], waitingPoints = [], stepMatrix = this.getRectMatrix(matrix.length);
    let active, stepNumb = 1;
    while (unvisited.length !== 0) {
      //console.log(steps);
      if (waitingPoints[0]) {
        active = waitingPoints[0];
        waitingPoints.splice(0, 1);
      } else {
        active = unvisited[0];
        unvisited.splice(0, 1);
      }
      colorSteps.push(this.generateStepColors(visited, unvisited, active));
      // console.log(active);
      if (!steps[active]) steps[active] = stepNumb++;
      if (!visited.includes(active)) visited.push(active);
      const activeMatrix = matrix[active];
      for (const index in activeMatrix) {
        if (activeMatrix[index] === 1 && !visited.includes(parseInt(index))) {
          //console.log(visited);
          //console.log({active, index});
          visited.push(parseInt(index));
          // console.log({active, index});
          const delInd = unvisited.indexOf(parseInt(index));
          if (delInd !== -1) unvisited.splice(unvisited.indexOf(parseInt(index)), 1);
          // console.log(unvisited);
          if (!waitingPoints.includes(index)) waitingPoints.push(index);
          if (!steps[index]) {
            steps[index] = stepNumb++;
            stepMatrix[active][index] = 1;
          }
          colorSteps.push(this.generateStepColors(visited, unvisited, active));
        }
      }
    }
    //console.log(colorSteps);
    return {steps, colorSteps, stepMatrix};
  }

  buildGraphs(context, points, ballRadius) {
    const color = ballColor;
    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      buildCircle(context, point, ballRadius, color);
    }
  }

  buildTree(points, matrix) {
    buildOnArrDirected(ctx2, matrix, points, ballRadius);
  }

  findInWidth(points, matrix) {
    buildOnArrDirected(ctx2, matrix, points, ballRadius);
  }

  getFourthLab() {
    if (windowWidth < 600)
      canvas2.height = mainRadius * 6;
    else canvas2.height = mainRadius * 5;
    ctx2.textBaseline = 'middle';
    ctx2.textAlign = 'center';
    ctx2.font = `15px sans-serif`;
    const {steps, colorSteps, stepMatrix} = this.getStepsAndColors();
    // console.log(steps);
    // console.log(stepMatrix);
    const findInWidthPoints = points;
    const treePoints = [];
    for (const point of points)
      treePoints.push({index: point.index, x: point.x, y: point.y + mainRadius * 2 + 100});
    this.findInWidth(findInWidthPoints, this.A);
    this.buildTree(treePoints, stepMatrix);
    const colors = colorSteps[this.calledInd % colorSteps.length];
    findInWidthPoints.map((point, ind) => buildCircle(ctx2, point, ballRadius, colors[ind]));
    treePoints.map((point, ind) => buildCircle(ctx2, point, ballRadius, this.unvisitedColor, `${ind + 1} (${steps[ind]})`));
  }
}

class FifthLab {
  constructor(A, weights, index) {
    this.A = convertInUndirected(A);
    this.weights = convertWeightsInUndirected(weights);
    this.imiginary_weight = 99999999;
    this.textColor = '#dd0008';
    this.index = index;
  }

  drawGraph(points, A = this.A) {
    const connections = new Connections(ballRadius);
    const len = A.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (A[i][j] === 1 && points[i] && points[j]) {
          let coordinates;
          if (i === j) {
            coordinates = connections.inItself(ctx2, points[i], ballRadius);
          } else coordinates = {x: (points[i].x + points[j].x)/2, y: (points[i].y + points[j].y)/2};
          // console.log(coordinates);
          ctx2.fillStyle = this.textColor;
          ctx2.textBaseline = 'middle';
          ctx2.textAlign = 'center';
          ctx2.font = `23px sans-serif`;
          ctx2.fillText(this.weights[i][j], coordinates.x, coordinates.y);
        }
      }
    }
    buildOnArr(ctx2, A, points);
  }

  generateMatrix(n) {
    const A = [];
    for (let i = 0; i < n; i++)
      A.push(new Array(n).fill(0));
    return A;
  }

  cloneMatrix (arr) {
    const A = [];
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      const line = arr[i];
      A.push([]);
      for (let j = 0; j < n; j++) {
        A[i][j] = arr[i][j];
      }
    }
    return A;
  }

  clonePoints (arr) {
    return [...arr];
  }

  generateSteps() {
    const len = this.A.length;
    const pointsIncluded = [points[0]];
    const newMatrix = this.generateMatrix(len);
    const steps = [];
    let weight = 0;
    while (pointsIncluded.length !== points.length) {
      let minWeight = this.imiginary_weight, minPoint = points.filter(point => !pointsIncluded.includes(point))[0], from = null;
      for (const point of pointsIncluded) {
        const i = point.index;
         for (const j in this.A[i]) {
           if (this.A[i][j] === 1) {
             if (this.weights[i][j] < minWeight && !pointsIncluded.includes(points[j])) {
               from = points[i];
               minWeight = this.weights[i][j];
               minPoint = points[j];
             }
           }
         }
      }
      if (weight < this.imiginary_weight) weight += minWeight;
      if (from) newMatrix[from.index][minPoint.index] = 1;
      pointsIncluded.push(minPoint);
      steps.push({points: this.clonePoints(pointsIncluded), matrix: this.cloneMatrix(newMatrix)});
    }
    return steps;
  }

  getLab() {
    if (windowWidth < 600)
      canvas2.height = mainRadius * 6;
    else canvas2.height = mainRadius * 5;
    ctx2.textBaseline = 'middle';
    ctx2.textAlign = 'center';
    ctx2.font = `15px sans-serif`;
    const steps = this.generateSteps();
    const step = steps[this.index % (steps.length + 1)];
    const lastStep = steps[steps.length - 1];
    const currentPointsForStep = step.points, currentMatrix = step.matrix;
    const lastPointsForStep = lastStep.points, lastMatrix = lastStep.matrix;
    const currentPoints = [], lastPoints = [];
    for (const point of currentPointsForStep)
      currentPoints[point.index] = {index: point.index, x: point.x, y: point.y + mainRadius * 2 + 100};
    for (const point of lastPointsForStep)
      lastPoints[point.index] = {index: point.index, x: point.x, y: point.y};
    // console.clear();
    //console.log(steps);
    // console.log(this.weights);
    this.drawGraph(currentPoints, currentMatrix);
    // this.drawGraph(lastPoints, lastMatrix);
    this.drawGraph(points);
    console.log(lastMatrix);
  }
}

class SixthLab {
  constructor(A, weights, index) {
    this.A = convertInUndirected(A);
    this.weights = convertWeightsInUndirected(weights);
    this.imiginary_weight = 99999999;
    this.startColor = '#ff0007';
    this.endColor = '#80dd47';
    this.shortWayColor = '#dd16dd';
    this.textColor = '#dd0008';
    this.longWayColor = '#ddc213';
    this.index = index % this.A.length;
  }

  findWay (from, to, shortest = true) {
    // console.log(this.weights);
    const activeList = [from];
    const constantPoints = [from], temporaryPoints = [...points].filter(point => point.index !== from.index), previousPoints = [],
      wayLength = new Array(this.A.length).fill(this.imiginary_weight);
    wayLength[from.index] = 0;
    let reached = false;
    while (!reached) {
      const active = activeList.shift();
      // console.log({active, constant: [...constantPoints], temporary: [...temporaryPoints],
      //   previous: [...previousPoints], waylen: [...wayLength], activeList: [...activeList]});
      if (!active)
        return;
      // if (!active) {
      //   console.log({constantPoints, temporaryPoints, previousPoints, wayLength});
      //   return;
      // }
      const line = this.A[active.index];
      for (const i in line) {
        // if (active.index === 2 && i == 11)
        //   console.log({includes: temporaryPoints.includes(points[11])});
        // if (active.index === 2 && i == 11)
        //   console.log({temporary: [...temporaryPoints]});
        if (line[i] === 1 && temporaryPoints.includes(points[i])) {
          const length = wayLength[active.index] + this.weights[active.index][i];
          // console.log({active: active.index, i, length, nowLength: wayLength[i]});
          // length < wayLength[i]
          if (length < wayLength[i]) {
            wayLength[i] = length;
            previousPoints[i] = active.index;
          }
        }
      }
      let minLen = this.imiginary_weight, minInd, pointIndInArr;
      for (const ind in temporaryPoints) {
        const point = temporaryPoints[ind];
        const index = point.index;
        if (wayLength[index] < minLen && index !== active.index) {
          minLen = wayLength[index];
          minInd = index;
          pointIndInArr = ind;
        }
      }
      if (minInd === to.index)
        reached = true;
      // console.log(minInd);
      if (minInd != undefined) {
        temporaryPoints.splice(pointIndInArr, 1);
        constantPoints.push(points[minInd]);
        activeList.push(points[minInd]);
      }
    }
    if (reached) {
      let currentInd = to.index;
      const way = [];
      while (currentInd !== from.index) {
        way.unshift(currentInd);
        currentInd = previousPoints[currentInd];
      }
      way.unshift(currentInd);
      return {weight: wayLength[to.index], route: way};
    }
  }

  drawGraph(points, A = this.A) {
    const connections = new Connections(ballRadius);
    const len = A.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (A[i][j] === 1 && points[i] && points[j]) {
          let coordinates;
          if (i === j) {
            coordinates = connections.inItself(ctx2, points[i], ballRadius);
          } else if (A[j][i] === 1 && i > j) {
            coordinates = connections.connectEachOther(ctx2, points[i], points[j]);
          } else coordinates = {x: (points[i].x + points[j].x)/2, y: (points[i].y + points[j].y)/2};
          ctx2.fillStyle = this.textColor;
          ctx2.textBaseline = 'middle';
          ctx2.textAlign = 'center';
          ctx2.font = `23px sans-serif`;
          if (A[j][i] === 1 && A[j][i] === 1)
            ctx2.fillText(weights[j][i], coordinates.x, coordinates.y);
          else ctx2.fillText(weights[i][j], coordinates.x, coordinates.y);
        }
      }
    }
    buildOnArrDirected(ctx2, A, points, ballRadius);
  }

  findAllWays() {
    const shortestWaysForAllPoints = [];
    for (let i = 0; i < this.A.length; i++) {
      let from = 0;
      let shortestWay = this.findWay(points[from], points[i]);
      while (!shortestWay && from < this.A.length - 1) {
        from++;
        shortestWay = this.findWay(points[from], points[i]);
      }
      shortestWaysForAllPoints.push(shortestWay ? shortestWay : []);
    }
    return shortestWaysForAllPoints;
  }

  getLab() {
    const shortestAll = this.findAllWays();
    // console.log(shortestAll);
    const fifthLab = new FifthLab(this.A, this.weights);
    fifthLab.drawGraph(points);
    const shortestWay = shortestAll[this.index].route;
    const shortestWeight = shortestAll[this.index].weight;
    buildCircle(ctx2, points[shortestWay[0]], ballRadius, this.startColor);
    buildCircle(ctx2, points[shortestWay[shortestWay.length - 1]], ballRadius, this.endColor);
    for (let index = 1; index < shortestWay.length - 1; index++)
      buildCircle(ctx2, points[shortestWay[index]], ballRadius, this.shortWayColor);
      }
}

function changeDirection() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (directed) {
    buildOnArrDirected(ctx, A, points, ballRadius);
    directed = false;
  } else {
    buildOnArr(ctx, A);
    directed = true;
  }
}

const buildCircle = (context, point, radius, fillStyle, text) => {
  // console.log(point);
  let { index, x, y } = point;
  if (!text) text = index + 1;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = fillStyle;
  context.fill();
  context.fillStyle = digitColor;
  if (index >= 0) {
    if (index >= 9)
      x -= 2.5;
    context.fillText(text, x, y);
  }
  context.closePath();
};

const findPoints = (alpha, mainX, mainY, ballRadius, mainRadius, n) => {
  let angle = 0;
  const point = {index: 0, x: mainX, y: mainY};
  const points = [];
  points.push({index: 0, x: mainX, y: mainY});
  for (let index = 1; index < n; index++) {
    const x = mainX - (mainRadius * Math.sin(angle));
    const y = mainY - (mainRadius * Math.cos(angle));
    const point = {index, x, y};
    points.push(point);
    angle += alpha;
  }
  // console.log({points});
  return points;
};

const buildGraphs = (context, points, ballRadius) => {
  context.font = `15px sans-serif`;
  const color = ballColor;
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    if (point) buildCircle(context, point, ballRadius, color);
  }
};


function buildOnArrDirected(context, A, points, ballRadius) {
  // console.clear();
  const connections = new Connections(ballRadius);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      if (A[i][j] === 1 && points[i] && points[j]) {
        if (i === j) connections.inItselfDirected(context, points[i], ballRadius);
        else if (A[j][i] === 1) {
          if ((i > j)) {
            connections.connectEachOther(context, points[i], points[j]);
          }
        } else
          connections.drawArrowedLine(context, points[i], points[j]);
      }
    }
  }
  buildGraphs(context, points, ballRadius);
}

function buildOnArr(context, A, points = points) {
  //context.clearRect(0, 0, canvas.width, canvas.height);
  const connections = new Connections(ballRadius);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (A[i][j] === 1) {
        if (i === j && points[i]) connections.inItself(context, points[i], ballRadius);
        else if (points[i] && points[j]) connections.connectPoints(context, points[i], points[j]);
      }
    }
  }
  buildGraphs(context, points, ballRadius);
}

const points = findPoints(alpha, mainX, mainY, ballRadius, mainRadius, n);

buildGraphs(ctx, points);

buildOnArrDirected(ctx, A, points, ballRadius);

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
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      if (B[i][j] == 1)
        B[j][i] = 1;
    }
  }
  return B;
}

function convertWeightsInUndirected(A) {
  const B = clone(A);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      if (B[i][j] !== imiginary_weight)
        B[j][i] = B[i][j];
    }
  }
  return B;
}

function displayText(context, text, additionalHeight = 0) {
  // canvas2.height = text.length + 1.5 * mainRadius * 2;
  const recommendedHeight = canvas.height;
  let startX = 10;
  let startY = 15;
  let distance;
  if (windowWidth < 1000) {
    distance = 14;
    const height = distance * text.length + additionalHeight + 15;
    if (canvas2.height < height)
      canvas2.height = height;
    if (height < recommendedHeight)
      canvas2.height = recommendedHeight;
    context.font = '12px Arial, serif';
  } else {
    distance = 16;
    const height = distance * text.length + additionalHeight + 15;
    if (canvas2.height < height)
      canvas2.height = height;
    if (height < recommendedHeight)
      canvas2.height = recommendedHeight;
    context.font = '14px Arial, sans-serif';
  }

  for (const str of text) {
    context.fillText(str, startX, startY);
    startY += distance;
  }
}

function getSecondLab() {
  clear();
  const secondLab = new SecondLab(A);
  const results = secondLab.getResults();
  displayText(ctx2, results);
}

function getThirdLab() {
  clear();
  const thirdLab = new ThirdLab(A);
  thirdLab.displayResults();
}


function clear() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  // canvas2.width = canvas2.height;
}

function getFourthLab() {
  clear();
  const fourthLab = new FourthLab(A, fourthLabCalledInd++);
  fourthLab.getFourthLab();
}

function getFifthLab() {
  clear();
  canvas2.height = canvas2.width;
  const fifthLab = new FifthLab(A, weights, fifthLabCalledInd++);
  fifthLab.getLab();
}

function getSixthLab() {
  clear();
  canvas2.height = canvas2.width;
  const sixthLab = new SixthLab(A, weights, sixLabCalledInd++);
  sixthLab.getLab();
  // console.log(sixthLab.findWay(points[1], points[11], false));
  // console.log(sixthLab.findWay(points[1], points[11]));
}

// const fourthLab = new FourthLab(A);
// fourthLab.getStepsAndColors();

// console.log(thirdLab.findWayWithExcludeRepeating(2));

// console.log(thirdLab.findWayWithExcludeRepeating(3));

// const testMatrix = [
//   [0, 1, 0, 1, 0],
//   [0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0],
//   [0, 0, 1, 0, 1],
//   [0, 1, 0, 0, 0]
// ];
//
// console.log(thirdLab.connectivityMatrix(testMatrix));

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

/*

const sixthLab = new SixthLab(A, weights);
const allWays = sixthLab.findAllWays();
for (const result of allWays) {
  console.log(`weight ${result.weight}, route: ${result.route.map(val => val + 1).join('-')}`);
}
console.log(convertInUndirected(A));

*/
