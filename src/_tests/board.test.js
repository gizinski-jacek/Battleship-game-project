const Gameboard = require('../board');

describe('Gameboard Factory functions', () => {
	let board;
	beforeEach(() => {
		board = new Gameboard();
		board.placeShip('shipM', 'hor', 2);
	});

	test('Correctly created board and placed 3 tile big ship', () => {
		expect(board.occupiedCells).toEqual([2, 3, 4]);
	});

	test('Correctly placed additional 2 tile big vertical ship', () => {
		board.placeShip('shipS', 'ver', 21);
		expect(board.occupiedCells).toEqual([2, 3, 4, 21, 31]);
	});

	test('Registers missed shots', () => {
		board.receiveShot(5);
		expect(board.missedShotsCells).toEqual([5]);
	});
});
