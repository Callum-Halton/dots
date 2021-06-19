import { SourceImage } from './samplePrepClasses.js';
import SampleData from './SampleData.js';

{

let sampleData;
onmessage = (e) => {
  let { data } = e;
  let { options } = data;
  if (data.shouldSample) {
    let { sourceImage } = e.data;
      SourceImage.addMethods(sourceImage);
      sourceImage.setOwnWidthAndHeightInCells(options.cellSize);
      sampleData = new SampleData(sourceImage, options);

      while (sampleData.hasActivePoints) {
        let spawnPoint = sampleData.randomActivePoint;
        let newPoint = sampleData.getPointNear(spawnPoint, sourceImage, options);
        if (newPoint) {
          sampleData.addPoint(newPoint);
        } else {
          sampleData.removeActivePoint(spawnPoint);
        }
      }
      sampleData.condense();

      postMessage({
        isSize: true,
        sizeKey: 'sample',
        size: sampleData.points.length,
      });
  } else {
    let { backgroundIntensity, drawSpecificNumOfDots } = options;
    let pointsToRender;
    if (drawSpecificNumOfDots) {
      pointsToRender = sampleData.pickNPoints(
        options.totDotsToDraw,
        options.whiteDotsOnBlackBackground
      );
    } else {
      pointsToRender = sampleData.points;
    }

    let dotsRendered = 0;
    for (let point of pointsToRender) {
      let lDiffTwixDotnBackground = Math.abs(point.l - backgroundIntensity)
      if (drawSpecificNumOfDots ||
          lDiffTwixDotnBackground >= options.minLDiffTwixDotnBackgroundToDraw) {

        let dotRadius = options.varyDotDiameter ?
          options.dotRadCalcConst * lDiffTwixDotnBackground + options.minDotRadius
          : options.maxDotRadius;

        let dotIntensity = options.varyDotBrightness ? point.l
          : options.maxDotIntensity;

        postMessage({
          isSize: false, x: point.x, y: point.y, r: dotRadius, l: dotIntensity
        });
        dotsRendered += 1;
      }
    }

    postMessage({ isSize: true, sizeKey: 'render', size: dotsRendered });
  }
}

}