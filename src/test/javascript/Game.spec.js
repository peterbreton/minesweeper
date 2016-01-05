describe('Game', function() {

    describe('Game', function() {
	var Game;

        beforeEach(function() {
            module('minesweeper');
        });

        beforeEach(angular.mock.inject (function(_Game_) {
            Game = _Game_;
        }));

        /////////
        // Tests
        /////////

        it('saves rows and columns', function() {
	    var g = Game.create(3,3);

	    expect(g._rows).toBe(3);
	    expect(g._columns).toBe(3);
        });

        it('has correct number of neighbors', function() {
	    var g = Game.create(3,3);

	    expect(g.neighbors(g.square(0,0)).length).toBe(3);
	    expect(g.neighbors(g.square(0,1)).length).toBe(5);
	    expect(g.neighbors(g.square(0,2)).length).toBe(3);

	    expect(g.neighbors(g.square(1,0)).length).toBe(5);
	    expect(g.neighbors(g.square(1,1)).length).toBe(8);
	    expect(g.neighbors(g.square(1,2)).length).toBe(5);

	    expect(g.neighbors(g.square(2,0)).length).toBe(3);
	    expect(g.neighbors(g.square(2,1)).length).toBe(5);
	    expect(g.neighbors(g.square(2,2)).length).toBe(3);
        });

        it('changes bombs remaining when flag is toggled', function() {
	    var g = Game.create(3,3,3);

	    expect(g.bombsRemaining()).toBe(3);

	    // One flag down
	    g.toggleFlag(1,1);

	    expect(g.bombsRemaining()).toBe(2);

	    // Another flag down
	    g.toggleFlag(1,2);

	    expect(g.bombsRemaining()).toBe(1);

	    // Restore one
	    g.toggleFlag(1,2);

	    expect(g.bombsRemaining()).toBe(2);
        });

        it('calculates elapsed seconds', function() {

	    var g = Game.create(3,3,3);

	    var started = new Date(Date.UTC(2016, 1, 2, 15, 20, 30));
	    var current = new Date(Date.UTC(2016, 1, 2, 15, 21, 5));

	    expect(g.elapsedSecondsInternal(started, current)).toBe(35);
        });

        it('returns correct end time', function() {

	    var g = Game.create(3,3,3);

	    var started = new Date(Date.UTC(2016, 1, 2, 15, 20, 30));
	    var current = new Date(Date.UTC(2016, 1, 2, 15, 21, 5));
	    var ended   = new Date(Date.UTC(2016, 1, 2, 15, 21, 35));

	    g.startTime(started);
	    g._endTime = ended;

	    g.status(Game.STATUS.START);
	    expect(g.endTime(current)).toBe(started);

	    g.status(Game.STATUS.PLAYING);
	    expect(g.endTime(current)).toBe(current);

	    g.status(Game.STATUS.WON);
	    expect(g.endTime(current)).toBe(ended);

	    g.status(Game.STATUS.LOST);
	    expect(g.endTime(current)).toBe(ended);
        });

    });
});
