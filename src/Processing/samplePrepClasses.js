// All used by app.js in creating parameters for getSample(...)
export class SourceImage {
  constructor(pixels, width, height) {
    this.pixels = pixels;
    this.width = width;
    this.height = height;
  }

  setOwnWidthAndHeightInCells(cellSize) {
    this.widthInCells = Math.ceil(this.width / cellSize)
    this.heightInCells = Math.ceil(this.height / cellSize)
  }

  getPixel(x, y) {
    return this.pixels[y * this.width + x];
  }
}

export class SampleOptions {
  constructor(verboseOptions) {
    for (let optionKey in verboseOptions) {
      this[optionKey] = verboseOptions[optionKey].val;
    }

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
    this.maxDotIntensity = this.whiteDotsOnBlackBackground ? 255 : 0;
  }
}