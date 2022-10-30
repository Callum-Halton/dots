
import Point from './Point.js';

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // min is inclusive, max is exclusive
  return Math.floor(Math.random() * (max - min) + min);
}

function randRange(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class SampleData {
  constructor(sourceImage, options) {
    this.points = [];
    this.orderedPoints = null;
    this.activePoints = [];
    this.activePointsCount = 0;
    this.cells = [];
    for (let y = 0; y < sourceImage.heightInCells; y++) {
      let row = [];
      for (let x = 0; x < sourceImage.widthInCells; x++) {
        row.push([]);
      }
      this.cells.push(row);
    }
    let sampleRadius = Math.ceil(options.sampleRadius);

    let initialPoint = new Point(
      randInt(sampleRadius, sourceImage.width - sampleRadius),
      randInt(sampleRadius, sourceImage.height - sampleRadius), options
    );
    initialPoint.computeL(sourceImage, false, options);
    this.addPoint(initialPoint);
  }

  addPoint(point) {
    this.points.push(point);
    this.activePoints.push(point);
    this.activePointsCount++;
    let cellPos = point.cellPos;
    this.cells[cellPos.row][cellPos.col].push(point);
  }

  removeActivePoint(point) {
    this.activePoints = this.activePoints.filter( p => p !== point );
    this.activePointsCount -= 1;
  }

  getCell(row, col) {
    return this.cells[row][col];
  }

  get hasActivePoints() {
    return this.activePointsCount > 0;
  }

  get randomActivePoint() {
    return this.activePoints[randInt(0, this.activePoints.length)];
  }

  pickNPoints(n, pickFromTop) {
    if (this.orderedPoints === null) {
      this.orderedPoints = [];
      for (let i = 0; i < 256; i++){
        this.orderedPoints.push([]);
      }
      for (let point of this.points) {
        this.orderedPoints[point.l].push(point);
      }
    }

    let processedOrderedPoints = this.orderedPoints.map(lBucket => [...lBucket]);
    if (pickFromTop) {
      processedOrderedPoints.reverse();
    }

    let pickedPoints = [];
    for (let lBucket of processedOrderedPoints) {
      while (lBucket.length > 0) {
        if (pickedPoints.length === n) {
          return pickedPoints;
        } else {
          let pickedPoint = lBucket[randInt(0, lBucket.length)];
          pickedPoints.push(pickedPoint);
          lBucket = lBucket.filter( p => p !== pickedPoint );
        }
      }
    }

    /* The number of dots you want to draw is larger than the number of
       points sampled. To sample more points, decrease the maxRadius. */
    console.log("!!!!!!!!!!!!!!! Not that many points were sampled !!!!!!!!!!!!!!!");
    return pickedPoints;
  }

  pointIsValid(candidatePoint, sourceImage, options) {
    let sampleRadius = options.sampleRadius;
    if (sampleRadius <= candidatePoint.x &&
        candidatePoint.x <= sourceImage.width - sampleRadius &&
        sampleRadius <= candidatePoint.y &&
        candidatePoint.y <= sourceImage.height - sampleRadius) {

      let { cellPos } = candidatePoint;
      if (options.varyDotDensity) {
        candidatePoint.computeL(sourceImage, true, options);
      }

      const scanPattern = [1, 2, 2, 2, 1];
      for (let rowOffset = -2; rowOffset < 3; rowOffset++) {
        let searchDistForRow = scanPattern[rowOffset + 2];
        for (let colOffset = -searchDistForRow;
             colOffset <= searchDistForRow; colOffset++) {
          let examinedRow = cellPos.row + rowOffset;
          let examinedCol = cellPos.col + colOffset;
          if (0 <= examinedRow && examinedRow < sourceImage.heightInCells &&
              0 <= examinedCol && examinedCol < sourceImage.widthInCells) {
            let examinedCell = this.getCell(examinedRow, examinedCol);
            for (let point of examinedCell) {
              let sqrDist = (candidatePoint.x - point.x) ** 2 +
                            (candidatePoint.y - point.y) ** 2;
              if (sqrDist < Math.max(candidatePoint.sqrR, point.sqrR)) {
                //console.log(Math.max(candidatePoint.sqrR, point.sqrR) - sqrDist)
                return false;
              }
            }
          }
        }
      }
      return true;
    }
    return false;
  }

  getPointNear(spawnPoint, sourceImage, options) {
    for (let i = 0; i < options.sampleLimit; i++) {
      let angle = randRange(0, 2 * Math.PI);
      let dist = randRange(spawnPoint.r, spawnPoint.doubleR);
      let f = spawnPoint.doubleR / spawnPoint.r;
      if (f !== 2) {
        console.log(f);
      }
      let candidatePoint = new Point(
        Math.floor(spawnPoint.x + (dist * Math.cos(angle))),
        Math.floor(spawnPoint.y + (dist * Math.sin(angle))), options
      );
      if (this.pointIsValid(candidatePoint, sourceImage, options)) {
        candidatePoint.computeL(sourceImage, false, options);
        return candidatePoint;
      }
    }
    return false;
  }

  condense() {
    delete this.activePoints;
    delete this.activePointsCount;
    delete this.cells;
  }
}