import { SourceImage } from './samplePrepClasses.js';
import SampleData from './SampleData.js';

{

let sampleData;
let pointsToRender;
let pointIndex;
let renderOptions;
let renderID;

function postCompletionMsg(processKey) {
  postMessage({ type: 'completionMsg', processKey: processKey });
}

function postSampleSize() {
  postMessage({ type: 'sampleSize', size: sampleData.points.length });
}

function postConinueRenderingQuery() {
  postMessage({ type: 'dotInfo', drawDot: false, renderID: renderID });
}

onmessage = (e) => {
  let { data } = e;
  let { command } = data;
  let options;
  switch (command) {
    case 'sample':
      options = data.options;
      let { sourceImage } = data;
      SourceImage.addMethods(sourceImage);
      sourceImage.setOwnWidthAndHeightInCells(options.cellSize);
      sampleData = new SampleData(sourceImage, options);

      let t0 = performance.now();
      while (sampleData.hasActivePoints) {
        let spawnPoint = sampleData.randomActivePoint;
        let newPoint = sampleData.getPointNear(spawnPoint, sourceImage, options);
        if (newPoint) {
          sampleData.addPoint(newPoint);
          let t1 = performance.now();
          // 30fps
          if (t1 - t0 >= 100/3) {
            postSampleSize();
            t0 = t1;
          }
        } else {
          sampleData.removeActivePoint(spawnPoint);
        }
      }

      sampleData.condense();
      postSampleSize();
      postCompletionMsg('sample');
      break;

    case 'prepRender':
      options = data.options;
      if (options.drawSpecificNumOfDots) {
        pointsToRender = sampleData.pickNPoints(
          options.totDotsToDraw,
          options.whiteDotsOnBlackBackground
        );
      } else {
        pointsToRender = sampleData.points;
      }
      pointIndex = 0;
      renderOptions = options;
      renderID = data.renderID;
      postConinueRenderingQuery();
      break;

    default:
      if (pointIndex >= pointsToRender.length) {
        postCompletionMsg('render');
      } else {
        let point = pointsToRender[pointIndex];
        let lDiffTwixDotnBackground = Math.abs(
          point.l - renderOptions.backgroundIntensity
        );
        if (renderOptions.drawSpecificNumOfDots || lDiffTwixDotnBackground
            >= renderOptions.minLDiffTwixDotnBackgroundToDraw) {

          let dotRadius = renderOptions.varyDotDiameter ?
            renderOptions.dotRadCalcConst * lDiffTwixDotnBackground
            + renderOptions.minDotRadius : renderOptions.maxDotRadius;

          let dotIntensity = renderOptions.varyDotBrightness ? point.l
            : renderOptions.maxDotIntensity;

          postMessage({
            type: 'dotInfo', drawDot: true, renderID: renderID,
            x: point.x, y: point.y, r: dotRadius, l: dotIntensity
          });
        } else {
          postConinueRenderingQuery();
        }
        pointIndex++;
      }
  }
}

}