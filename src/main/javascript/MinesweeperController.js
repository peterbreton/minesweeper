/*global angular:true */
"use strict";

angular.module('minesweeper')
.config(function ($locationProvider) {
    // Required for $location.search to return request parameters
    $locationProvider.html5Mode(true);
})
.controller('MinesweeperController', ['$scope', '$interval', '$location', '$log', 'Game', 'Square', function($scope, $interval, $location, $log, Game, Square) {

    $log.debug('Loaded MinesweeperController');

    $scope.SETTINGS = {
	easy: {
	    rows: 9,
	    columns: 9,
	    bombs: 10
	},

	medium: {
	    rows: 16,
	    columns: 16,
	    bombs: 40
	},

	expert: {
	    rows: 16,
	    columns: 30,
	    bombs: 99
	}
    };

    $scope.getOrCreateGame = function() {

	if (! $scope.game) {
	    $scope.startGame();
	}

	return $scope.game;
    };

    $scope.reveal = function(row, column) {
	$scope.getOrCreateGame().reveal(row, column);
    };

    $scope.toggleFlag = function(row, column) {
	$scope.getOrCreateGame().toggleFlag(row, column);
    };

    // Utility function
    $scope.createArray = function(low, high) {
	var result = [];

	for(var i = low; i <= high; i++) {
	    result.push(i);
	}

	return result;
    }

    $scope.resetGame = function() {
	delete $scope.game;
    }

    $scope.startGame = function() {
	$scope.game = Game.create($scope.settings.rows, $scope.settings.columns, $scope.settings.bombs);
    }

    $scope.elapsedSeconds = function() {
	if (! $scope.game) {
	    return '0';
	}

	return $scope.game.elapsedSeconds().toString();
    }

    $scope.gameStatus = function() {
	if (! $scope.game) {
	    return Game.STATUS.START;
	}

	return $scope.game.status();
    }

    $scope.tileStatus = function(row, column) {
	if (! $scope.game) {
	    return Square.STATUS.HIDDEN;
	}

	var square = $scope.game.square(row, column);

	return square && square.status();
    }

    $scope.bombsRemaining = function() {
	if (! $scope.game) {
	    return $scope.settings.bombs;
	}

	return $scope.game.bombsRemaining();
    }

    $scope.bombsAround = function(row, column) {
	if ($scope.game) {
	    var s = $scope.game.square(row, column);

	    if (s.visible() && ! s.bomb() && s.bombsAround() > 0) {
		return s.bombsAround();
	    }
	}
    }

    $scope.initialize = function(mode) {
	$scope.settings = $scope.SETTINGS[mode] || $scope.SETTINGS.easy;

	// IMPORTANT: This converts between the rows and columns (eg, 3x3) and
	// the 0-based arrays which hold the game tiles.
	$scope.gridWidth  = $scope.createArray(0, $scope.settings.rows -1);
	$scope.gridHeight = $scope.createArray(0, $scope.settings.columns -1);

	delete $scope.game;
    }

    $scope.initialize($location.search().mode);

    // Updates the elapsed time every second.
    $scope.elapsedSecondsTimer = $interval(angular.noop, 1000);
}]);
