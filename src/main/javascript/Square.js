/*global angular:true */
"use strict";

angular.module('minesweeper').service('Square', function() {

    var Square = function() {
	return this;
    };

    var that = this;

    // Simple status pseudo-enum
    this.STATUS = {
	'BOMB'      : 'BOMB',
	'FINAL_BOMB': 'FINAL_BOMB',
	'VISIBLE'   : 'VISIBLE',
	'FLAGGED'   : 'FLAGGED',
	'HIDDEN'    : 'HIDDEN'
    };

    // Properties
    Square.prototype.bomb = function(s) {
	if (s === undefined) {
	    return this._bomb;
	}

	this._bomb = s;
    };

    Square.prototype.bombsAround = function(s) {
	if (s === undefined) {
	    return this._bombsAround;
	}

	this._bombsAround = s;
    };

    Square.prototype.visible = function(s) {
	if (s === undefined) {
	    return this._visible;
	}

	this._visible = s;
    };

    Square.prototype.row = function(s) {
	if (s === undefined) {
	    return this._row;
	}

	this._row = s;
    };

    Square.prototype.column = function(s) {
	if (s === undefined) {
	    return this._column;
	}

	this._column = s;
    };

    Square.prototype.finalMove = function(s) {
	if (s === undefined) {
	    return this._finalMove;
	}

	this._finalMove = s;
    };

    Square.prototype.flagged = function(s) {
	if (s === undefined) {
	    return this._flagged;
	}

	this._flagged = s;
    };

    Square.prototype.toggleFlag = function() {
	this._flagged = ! this._flagged;
    };

    // Convenience functions
    Square.prototype.previousRow = function() {
	return this._row - 1;
    };

    Square.prototype.nextRow = function() {
	return this._row + 1;
    };

    Square.prototype.previousColumn = function() {
	return this._column -1;
    };

    Square.prototype.nextColumn = function() {
	return this._column + 1;
    };

    Square.prototype.isFirstRow = function() {
	return this._row === 0;
    };

    Square.prototype.isFirstColumn = function() {
	return this._column === 0;
    };

    Square.prototype.isLastRow = function() {
	return this._lastRow;
    };

    Square.prototype.isLastColumn = function() {
	return this._lastColumn;
    };

    Square.prototype.status = function() {

	if (this.visible()) {
	    // Appears if you lose
	    if (this.bomb()) {
		return this.finalMove() ? that.STATUS.FINAL_BOMB : that.STATUS.BOMB;
	    }

	    return that.STATUS.VISIBLE;
	}

	if (this.flagged()) {
	    return that.STATUS.FLAGGED;
	}

	return that.STATUS.HIDDEN;
    };

    this.create = function(row, column, lastRow, lastColumn) {
	var s = new Square();

	s.visible(false);
	s.flagged(false);
	s.bomb(false);

	s.row(row);
	s.column(column);

	s._lastRow = lastRow;
	s._lastColumn = lastColumn;

	return s;
    };
});
