// All used by app.js in creating data for processor.js
export class SourceImage {
  constructor(pixels, width, height) {
    this.pixels = pixels;
    this.width = width;
    this.height = height;
  }

  static addMethods(sourceImage) {
    sourceImage.setOwnWidthAndHeightInCells = (cellSize) => {
      sourceImage.widthInCells = Math.ceil(sourceImage.width / cellSize)
      sourceImage.heightInCells = Math.ceil(sourceImage.height / cellSize)
    }
    sourceImage.getPixel = (x, y) => {
      return sourceImage.pixels[y * sourceImage.width + x];
    }
  }
}

class Options {
  constructor(verboseOptions) {
    for (let optionKey in verboseOptions) {
      this[optionKey] = verboseOptions[optionKey].val;
    }
    this.maxDotIntensity = this.whiteDotsOnBlackBackground ? 255 : 0;
  }
}

export class SampleOptions extends Options {
  constructor(verboseOptions) {
    super(verboseOptions);

    // Computed Constants
    this.sqrMaxExclRadius = this.maxExclRadius ** 2
    if (this.varyDotDensity) {
      this.exclRadiusDiff = this.maxExclRadius - this.minExclRadius;
      this.sampleRadius = Math.floor(
        (this.minExclRadius + this.maxExclRadius) / 2);
    } else {
      this.sampleRadius = Math.floor(this.maxExclRadius / 2);
    }
    this.sqrSampleRadius = this.sampleRadius ** 2;
    this.cellSize = Math.floor(this.maxExclRadius / Math.sqrt(2));
  }
}

export class RenderOptions extends Options {
  constructor(verboseOptions) {
    super(verboseOptions);

    // Computed Constants
    this.minDotRadius = this.minDotDiameter / 2;
    this.maxDotRadius = this.maxDotDiameter / 2;
    this.backgroundIntensity = this.whiteDotsOnBlackBackground ? 0 : 255;
    this.dotRadCalcConst = (this.maxDotRadius - this.minDotRadius) / 255;
  }
}
