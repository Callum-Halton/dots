
function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
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
      cells.push(row);
    }
    let sampleRadius = Math.ceil(options.sampleRadius);

    let initialPoint = Point(
      randint(sampleRadius, sourceImage.width - sampleRadius),
      randint(sampleRadius, sourceImage.height - sampleRadius), options
    );
    initialPoint.computeL(sourceImage, false);
    this.addNewPoint(initialPoint);
  }

  addPoint(point) {
    this.points.push(point);
    this.activePoints.push(point);
    this.activePointsCount += 1;
    cellPos = point.cellPos;
    this.cells[cellPos.row][cellPos.col].push(point);
  }

  removeActivePoint(point) {
    this.activePoints.filter( p => { p !== point } );
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
        this.orderedPoints[point.l].append(point);
      }
    }

    let processedOrderedPoints = [...this.orderedPoints];
    if (pickFromTop) {
      processedOrderedPoints = processedOrderedPoints.reverse();
    }

    let pickedPoints = []
    for (let lBucket of processedOrderedPoints) {
      while (lBucket.length > 0) {
        if (pickedPoints.length === n) {
          return pickedPoints;
        } else {
          let pickedPoint = pickedPoints[randInt(0, pickedPoints.length)];
          pickedPoints.push(pickedPoint);
          lBucket.filter( p => { p !== pickedPoint } );
        }
      }
    }

    console.log("!!!!!!!!!!!!!!! Not that many points were sampled !!!!!!!!!!!!!!!");
    return pickedPoints;
  }

  condense() {
    delete this.activePoints;
    delete this.activePointsCount;
    delete this.cells;
  }
}



//  def getPoints(self):
//    return copy.deepcopy(this.points) # return a copy to protect hidden state

  def pickNPoints(self, n, pickFromTop):
    if this.orderedPoints is None:
      this.orderedPoints = [[] for i in range(256)]
      for point in this.getPoints():
        this.orderedPoints[point.l].append(point)

    processedOrderedPoints = copy.deepcopy(this.orderedPoints)
    if pickFromTop:
      processedOrderedPoints = reversed(processedOrderedPoints)

    pickedPoints = []
    for lBucket in processedOrderedPoints:
      while lBucket:
        if len(pickedPoints) == n:
          return(pickedPoints)
        else:
          pickedPoint = random.choice(lBucket)
          pickedPoints.append(pickedPoint)
          lBucket.remove(pickedPoint)

    print("The number of dots you want to draw is larger than the number of" +
      " points sampled.\nTo sample more points, decrease the maxRadius.")
    return pickedPoints

# Move to State
def pointIsValid(state, sourceImage, candidatePoint, options):
  maxDrawRadius = options.getMaxDrawRadius()
  if (maxDrawRadius <= candidatePoint.x <= sourceImage.width - maxDrawRadius and
      maxDrawRadius <= candidatePoint.y <= sourceImage.height - maxDrawRadius):

    cellPos = candidatePoint.getCellPos()
    if options.getVaryDotDensity():
      candidatePoint.computeL(sourceImage, True)

    SCANPATTERN = [1, 2, 2, 2, 1]
    for y in range(-2,3):
      extentMagForRow = SCANPATTERN[y + 2]
      for x in range(-extentMagForRow, extentMagForRow + 1):
        examinedRow, examinedCol = cellPos.y + y, cellPos.x + x
        if (0 <= examinedRow < sourceImage.heightInCells and
            0 <= examinedCol < sourceImage.widthInCells):
          examinedCell = state.getCell(examinedRow, examinedCol)
          for point in examinedCell:
            sqrDistance = ((candidatePoint.x - point.x) ** 2 +
                           (candidatePoint.y - point.y) ** 2)
            if options.getVaryDotDensity():
              # Optimise here by precomputing r**2 for each point upon computeL
              if sqrDistance < max(candidatePoint.r, point.r) ** 2:
                return False
            elif sqrDistance < options.getSqrRadius():
              return False
    return True
  return False


# Problably move to state class
def getPointNear(state, sourceImage, spawnPoint, options):
  for i in range(options.getSampleLimit()):
    angle = random.uniform(0, 2 * math.pi)
    dist = random.uniform(spawnPoint.r, 2 * spawnPoint.r)
    candidatePoint = Point(int(spawnPoint.x + (dist * math.cos(angle))),
                           int(spawnPoint.y + (dist * math.sin(angle))),
                           options)
    if pointIsValid(state, sourceImage, candidatePoint, options):
      return candidatePoint
  return False