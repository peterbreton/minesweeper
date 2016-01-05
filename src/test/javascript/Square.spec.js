describe('Square', function() {

    describe('Square', function() {
	var Square;

        beforeEach(function() {
            module('minesweeper');
        });

        beforeEach(angular.mock.inject (function(_Square_) {
            Square = _Square_;
        }));

        /////////
        // Tests
        /////////

        it('creates a new square', function() {
	    var s = Square.create(3,3, true, true);

	    expect(s.visible()).toBe(false);
	    expect(s.status()).toBe(Square.STATUS.HIDDEN);

	    expect(s.row()).toBe(3);
	    expect(s.column()).toBe(3);

	    expect(s.previousRow()).toBe(2);
	    expect(s.previousColumn()).toBe(2);

	    expect(s.nextRow()).toBe(4);
	    expect(s.nextColumn()).toBe(4);

	    expect(s.isFirstRow()).toBe(false);
	    expect(s.isFirstColumn()).toBe(false);

	    expect(s.isLastRow()).toBe(true);
	    expect(s.isLastColumn()).toBe(true);
        });

        it('handles isFirst correctly', function() {
	    var s = Square.create(0,3);

	    expect(s.isFirstRow()).toBe(true);
	    expect(s.isFirstColumn()).toBe(false);

	    s = Square.create(3,0);

	    expect(s.isFirstRow()).toBe(false);
	    expect(s.isFirstColumn()).toBe(true);
        });

        it('toggles flag correctly', function() {
	    var s = Square.create(2,2);

	    // Value is initially undefined or false
	    s.toggleFlag();
	    expect(s.flagged()).toBe(true);

	    s.toggleFlag();
	    expect(s.flagged()).toBe(false);

	    s.toggleFlag();
	    expect(s.flagged()).toBe(true);
        });

        it('returns correct status', function() {
	    var s = Square.create(2,2);

	    // Initial status
	    // Not flagged, not visible, not a bomb
	    expect(s.status()).toBe(Square.STATUS.HIDDEN);

	    // Flagged, not a bomb
	    s.flagged(true);
	    expect(s.status()).toBe(Square.STATUS.FLAGGED);

	    // Flagged, is a bomb
	    s.bomb(true);
	    expect(s.status()).toBe(Square.STATUS.FLAGGED);

	    // Visible, is a bomb
	    s.visible(true);
	    expect(s.status()).toBe(Square.STATUS.BOMB);

	    // Visible, not a bomb
	    s.bomb(false);
	    expect(s.status()).toBe(Square.STATUS.VISIBLE);
        });

    });
});
