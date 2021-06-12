
class CellPos {
	constructor(col, row) {
		this.col = col;
		this.row = row;
	}
}

class Point {
	constructor(x, y, options) {
		this.x = x;
		this.y = y;
		this.r = ;
		this.sqrR = options.sqrMaxExclRadius;
		this.l = null;

		let { cellSize } = options;
		this.cellPos = new CellPos(
			Math.floor(this.x / cellSize), Math.floor(this.y / cellSize)
		);

		computeL(sourceImage, squareSample, options) {
			let totLuminosity = 0;
	    let pixelsSampled = 0;
	    let { sampleRadius } = option;
	    for (let x = this.x - sampleRadius; x < this.x + sampleRadius; x++) {
	      for (let y = this.y - sampleRadius; y < this.y + sampleRadius; y++) {
	        if ((0 <= x && x < sourceImage.width
		        	&& 0 <= y && y < sourceImage.height)
		        	&& (squareSample or (self.x - x) ** 2 + (self.y - y) ** 2
		          <= options.sqrSampleRadius)) {
	          totLuminosity += sourceImage.getPixel(x, y);
            pixelsSampled += 1;
	        }
        }
      }

	    this..l = Math.floor(totLuminosity / pixelsSampled);
	    if (options.varyDotDensity) {
	      this.sqrR = options.minExclRadius
	        + Math.floor(Math.abs(options.maxDotIntensity - this.l)
	        / 255 * options.maxExclRadius);
	    }
		}
	}
}