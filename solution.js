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
document.getElementById('3Lab').addEventListener('click', getThirdLab, null);
document.getElementById('clear').addEventListener('click', clear, null);

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
// console.log({ wH: windowHeight, wW: windowWidth, height: canvas.height, width: canvas.width });

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
// const points = []; //Array of poins
const letterSize = ballRadius * 0.4;
let directed = false;

ctx.textBaseline = 'middle';
ctx.textAlign = 'center';
ctx.font = `15px Times New Roman`;

ctx2.textBaseline = 'middle';
ctx2.textAlign = 'center';
ctx2.font = `15px Times New Roman`;


const A = [
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
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
    ctx2.textBaseline = 'middle';
    ctx2.textAlign = 'center';
    ctx2.font = `15px Times New Roman`;
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
    console.log({radius, centreX, centreY, points});
  }

  getResults() {
    const secondLab = new SecondLab(this.A);
    const inside = secondLab.edgesInside(this.A);
    const outside = secondLab.edgesOutside(this.A);
    const waysTwoLength = this.findWayWithExcludeRepeating(2);
    const waysThreeLength = this.findWayWithExcludeRepeating(3);
    const reachabilityMatrix = this.reachabilityMatrix(this.A);
    const connectivityMatrix = this.connectivityMatrix(this.A);
        const componentas = this.buildCondensationMatrix(this.A);
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
    let positionY;
    if (windowWidth < 1000)
      positionY = 12 * results.length;
    else positionY = 16 * results.length;
    displayText(ctx2, results);

    this.buildCondensationGraph(this.A, positionY);
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

const buildCircle = (context, point, radius, fillStyle) => {
  let { index, x, y } = point;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = fillStyle;
  context.fill();
  context.fillStyle = digitColor;
  if (index >= 0) {
    if (index >= 9)
      x -= 2.5;
    context.fillText(index + 1, x, y);
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
  console.log({points});
  return points;
};

const buildGraphs = (context, points, ballRadius) => {
  const color = ballColor;
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    buildCircle(context, point, ballRadius, color);
  }
};


function buildOnArrDirected(context, A, points, ballRadius) {
  // console.clear();
  console.log({A, points});
  const connections = new Connections(ballRadius);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      if (A[i][j] === 1) {
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

function buildOnArr(context, A) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const connections = new Connections(ballRadius);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (A[i][j] === 1) {
        if (i === j) connections.inItself(context, points[i], ballRadius);
        else
          connections.connectPoints(context, points[i], points[j]);
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
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (B[i][j] == 1)
        B[j][i] = 1;
    }
  }
  return B;
}

function displayText(context, text) {
  // canvas2.height = text.length + 1.5 * mainRadius * 2;
  let startX = 10;
  let startY = 15;
  let distance;
  if (windowWidth < 1000) {
    distance = 12;
    console.log('smaller');
    const height = distance * text.length + mainRadius * 3 + 30;
    if (canvas2.height < height)
      canvas2.height = height;
    context.font = '10px Arial, serif';
  } else {
    distance = 16;
    const height = distance * text.length + mainRadius * 3 + 30;
    if (canvas2.height < height)
      canvas2.height = height;
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
}

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
