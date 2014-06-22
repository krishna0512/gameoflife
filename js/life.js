/**
 * TODO:
 * --- 	Add an interface to this canvas to select width, height and seed etc.
 */
window.onload = function () {
	var cellsize = 5;
	var width = window.innerWidth - 40;
	var height = window.innerHeight - 20;
	var canvas = document.getElementById("grid");

	var w = Math.floor (width / cellsize) * cellsize;
	var h = Math.floor (height / cellsize) * cellsize;
	
	canvas.width = w;
	canvas.height = h;
	
	var golly = (function (row, col) {
		var grid = new Array (row);
		var next = new Array (row);
		for (var i=0;i<row;i++) {
			grid[i] = new Array (col);
			next[i] = new Array (col);
		}

		// Randomly INIT the grid array.
		var randomInit = function (p) {
			var seed = p || 0.5;
			for (var i=0;i<row;i++) {
				for (var j=0;j<col;j++) {
					grid[i][j] = Math.random() < seed;
				}
			}
		};

		// Counts the ALIVE neighbours of a cell.
		var countNeighbours = function (r,c) {
			var count = 0;
			for (var i=r-1;i<=r+1;i++) {
				for (var j=c-1;j<=c+1;j++) {
					// Toroidal Array.
					var ii = (i<0) ? (i+row) : i;
					ii %= row;

					var jj = (j<0) ? (j+col) : j;
					jj %= col;

					if (ii==r && jj==c) continue;

					if (grid[ii][jj]) count++;
				}
			}
			return count;
		};

		var copy = function (src, dest) {
			for (var i=0;i<src.length;i++) {
				for (var j=0;j<src[i].length;j++) {
					dest[i][j] = src[i][j];
				}
			}
		};

		var nextGeneration = function () {
			for (var i=0;i<row;i++) {
				for (var j=0;j<col;j++) {
					var count = countNeighbours(i,j);
					next[i][j] = ((grid[i][j] && count>=2 && count<=3) || (!grid[i][j] && count==3));
				}
			}
			copy (next, grid);
		};

		var draw = function (canvas) {
			var c = canvas.getContext("2d");
			c.fillStyle = "black";
			c.fillRect(0,0,canvas.width,canvas.height);
			c.fillStyle = "rgb(166,226,46)";
			for (var i=0;i<row;i++) {
				for (var j=0;j<col;j++) {
					if (grid[i][j])
						c.fillRect(i*cellsize, j*cellsize, cellsize,cellsize);
				}
			}
		};

		var init = function (canvas) {
			randomInit();
			(function callback () {
				nextGeneration();
				draw(canvas);
				window.requestAnimationFrame(callback);
			})();
		};

		return {init: init};

	})(w/cellsize, h/cellsize);

	golly.init(canvas);
};
