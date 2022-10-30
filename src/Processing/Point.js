
class CellPos {
	constructor(col, row) {
		this.col = col;
		this.row = row;
	}
}

export default class Point {
	constructor(x, y, options) {
		this.x = x;
		this.y = y;
		this.l = null;

		this.r = options.maxExclRadius;
		this.doubleR = 2 * options.maxExclRadius;
		this.sqrR = options.sqrMaxExclRadius;

		let { cellSize } = options;
		this.cellPos = new CellPos(
			Math.floor(this.x / cellSize), Math.floor(this.y / cellSize)
		);
	}

	computeL(sourceImage, squareSample, options) {
		let totLuminosity = 0;
    let pixelsSampled = 0;
    let { sampleRadius } = options;
    for (let x = this.x - sampleRadius; x < this.x + sampleRadius; x++) {
      for (let y = this.y - sampleRadius; y < this.y + sampleRadius; y++) {
        if ((0 <= x && x < sourceImage.width
	        	&& 0 <= y && y < sourceImage.height)
	        	&& (squareSample || (this.x - x) ** 2 + (this.y - y) ** 2
	          <= options.sqrSampleRadius)) {
          totLuminosity += sourceImage.getPixel(x, y);
          pixelsSampled++;
        }
      }
    }

    this.l = Math.floor(totLuminosity / pixelsSampled);
    if (options.varyDotDensity) {
      this.r = options.minExclRadius
        + Math.floor(Math.abs(options.maxDotIntensity - this.l)
        / 255 * options.maxExclRadius);
      this.doubleR = this.r * 2;
      this.sqrR = this.r ** 2;
    }
	}
}