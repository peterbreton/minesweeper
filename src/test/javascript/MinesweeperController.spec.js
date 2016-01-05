describe('Minesweeper Controller', function() {

    describe('Minesweeper Controller', function() {
	var Game, Square, $scope;

        beforeEach(function() {
            module('minesweeper');
        });

        beforeEach(angular.mock.inject (function(_Game_, _Square_, $controller, $rootScope) {
            Game   = _Game_;
            Square = _Square_;

	    $scope = $rootScope.$new();

            $controller('MinesweeperController', {$scope: $scope});
        }));

        /////////
        // Tests
        /////////

        it('fills an array', function() {
	    expect($scope.createArray(1,3)).toEqual([1,2,3]);
	    expect($scope.createArray(0,4)).toEqual([0,1,2,3,4]);
	});

        it('creates a game', function() {
	    expect($scope.game).toBe(undefined);

	    $scope.getOrCreateGame();

	    expect($scope.game).not.toBe(undefined);
	});

        it('shows game status', function() {
	    expect($scope.game).toBe(undefined);

	    expect($scope.gameStatus()).toBe(Game.STATUS.START);

	    $scope.startGame();
	    $scope.game.status(Game.STATUS.WON);

	    expect($scope.gameStatus()).toBe($scope.game.status());
	});
    });
});
