/*global angular:true */
"use strict";

angular.module('minesweeper').service('Game', ['Square', function(Square) {

    var Game = function(options) {
        options && angular.copy(options, this);

	return this;
    };

    var that = this;

    // Simple status pseudo-enum
    this.STATUS = {
	'START'  : 'START',
	'PLAYING': 'PLAYING',
	'LOST'   : 'LOST',
	'WON'    : 'WON'
    };

    // Properties
    Game.prototype.status = function(s) {
	if (s === undefined) {
	    return this._status;
	}

	this._status = s;
    };

    Game.prototype.bombsRemaining = function(t) {
	if (t === undefined) {
	    return this._bombsRemaining;
	}

	this._bombsRemaining = t;
    };

    Game.prototype.startTime = function(t) {
	if (t === undefined) {
	    return this._startTime;
	}

	this._startTime = t;
    };

    Game.prototype.endTime = function(current) {
	var status = this.status();

	if (status === that.STATUS.PLAYING) {
	    return current;
	}

	if (status === that.STATUS.WON || status == that.STATUS.LOST) {
	    return this._endTime;
	}

	return this._startTime;
    };

    Game.prototype.elapsedSeconds = function() {
	return this.elapsedSecondsInternal(this._startTime, this.endTime(new Date()));
    };

    Game.prototype.elapsedSecondsInternal = function(start, current) {

	var raw = current.getTime() - start.getTime();

	return Math.round(raw / 1000);
    };

    // Utility function from http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
    Game.prototype.getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    Game.prototype.randomSquare = function(alreadyAssigned) {
	var row    = this.getRandomInt(0, this._rows - 1);
	var column = this.getRandomInt(0, this._columns - 1);

	var square = this.square(row, column);

	if (alreadyAssigned.indexOf(square) === -1) {
	    alreadyAssigned.push(square);
	    return square;
	}

	// Recursive call, assume that it will eventually find one
	return this.randomSquare(alreadyAssigned);
    };

    Game.prototype.assignBombs = function(startingSquare) {
	var assigned = [ startingSquare ];

	for(var i = 0; i < this._bombs; i++) {
	    var s = this.randomSquare(assigned);
	    s.bomb(true);
	}

	var g = this;

	this.eachSquare(function(s) {
	    s.bombsAround(g.bombsAround(s));
	});
    };

    Game.prototype.square = function(x, y) {
	return this._grid[x][y];
    };

    Game.prototype.eachSquare = function(func) {
	for(var i = 0; i < this._rows; i++) {
	    for(var j = 0; j < this._columns; j++) {
		var s = this.square(i, j);
		func(s);
	    }
	}
    };

    Game.prototype.reveal = function(x, y) {
	var square = this.square(x,y);

	// First move
	if (this.status() === that.STATUS.START) {
	    this.assignBombs(square);

	    this.status(that.STATUS.PLAYING);
	}
	else if (square.bomb()) {
	    square.finalMove(true);

	    return this.endGame(that.STATUS.LOST);
	}

	square.visible(true);

	// Check if they won
	if (this.hiddenSpaces() === this._bombs) {
	    return this.endGame(that.STATUS.WON);
	}

	this.showClearedSpaces(square);
    };

    Game.prototype.showClearedSpaces = function(square) {

	if (square.bombsAround() !== 0) {
	    return;
	}

	var neighbors = this.neighbors(square);

	for(var i = 0; i < neighbors.length; i++) {
	    var n = neighbors[i];

	    var visible = n.visible();

	    n.visible(true);

	    if (n.bombsAround() === 0 && ! visible) {
		this.showClearedSpaces(n);
	    }
	}
    };

    Game.prototype.endGame = function(status) {
	this.status(status);

	this._endTime = new Date();

	if (status === that.STATUS.LOST) {
	    this.showBombs();
	}
    };

    Game.prototype.neighbors = function(square) {
	var results = [];

	// Previous row
	if (! square.isFirstRow()) {
	    if (! square.isFirstColumn()) {
		results.push(this.square(square.previousRow(), square.previousColumn()));
	    }

	    results.push(this.square(square.previousRow(), square.column()));

	    if (! square.isLastColumn(square)) {
		results.push(this.square(square.previousRow(), square.nextColumn()));
	    }
	}

	// Current row
	if (! square.isFirstColumn()) {
	    results.push(this.square(square.row(), square.previousColumn()));
	}

	// Skip the square itself

	if (! square.isLastColumn(square)) {
	    results.push(this.square(square.row(), square.nextColumn()));
	}

	// Next row
	if (! square.isLastRow()) {
	    if (! square.isFirstColumn()) {
		results.push(this.square(square.nextRow(), square.previousColumn()));
	    }

	    results.push(this.square(square.nextRow(), square.column()));

	    if (! square.isLastColumn(square)) {
		results.push(this.square(square.nextRow(), square.nextColumn()));
	    }
	}

	return results;
    };

    Game.prototype.bombsAround = function(square) {
	var count = 0;
	var neighbors = this.neighbors(square);

	for(var i = 0; i < neighbors.length; i++) {
	    if (neighbors[i].bomb()) {
		count++;
	    }
	}

	return count;
    };

    Game.prototype.toggleFlag = function(x, y) {
	var square = this.square(x,y);

	square.toggleFlag();

	var adjust = square.flagged() ? -1 : 1;
	this.bombsRemaining(this.bombsRemaining() + adjust);
    };

    Game.prototype.showAll = function() {
	this.eachSquare(function(s) {
	    s.visible(true);
	});
    };

    Game.prototype.showBombs = function() {
	this.eachSquare(function(s) {
	    if (s.bomb()) {
		s.visible(true);
	    }
	});
    };

    Game.prototype.hiddenSpaces = function() {
	var count = 0;

	for(var i = 0; i < this._rows; i++) {
	    for(var j = 0; j < this._columns; j++) {
		if (! this.square(i, j).visible()) {
		    count++;
		}
	    }
	}

	return count;
    };

    this.create = function(rows, columns, bombs) {

	var g = new Game({
	    _status: this.STATUS.START,
	    _rows: rows,
	    _columns: columns,
	    _grid: [],
	    _bombs: bombs,
	    _bombsRemaining: bombs,
	    _startTime: new Date()
	});

	// Initialize the grid
	for(var i = 0; i < rows; i++) {
	    g._grid[i] = [];
	    for(var j = 0; j < columns; j++) {
		var lastRow    = (i === rows -1);
		var lastColumn = (j === columns -1);
		g._grid[i][j] = Square.create(i, j, lastRow, lastColumn);
	    }
	}

	return g;
    };
}]);
