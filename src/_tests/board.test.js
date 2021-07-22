const Gameboard = require('../board');

describe('Gameboard Factory functions', () => {
	let board;

	beforeEach(() => {
		board = new Gameboard();
		board.placeShip('shipM', 'hor', 2);
	});

	test('Getters return correct values', () => {
		expect(board.getOccupiedCells).toEqual([2, 3, 4]);
		expect(board.getMissedShotsCells).toEqual([]);
		expect(board.getShipList).toEqual([
			{
				_name: 'M',
				_size: 3,
				_hits: [],
				_cellsOccupied: [2, 3, 4],
			},
		]);
	});

	test('Correctly created board and placed 3 tile big ship', () => {
		expect(board.getOccupiedCells).toEqual([2, 3, 4]);
	});

	test('Correctly placed additional 2 tile big vertical ship', () => {
		board.placeShip('shipS', 'ver', 21);
		expect(board.getOccupiedCells).toEqual([2, 3, 4, 21, 31]);
	});

	test('Registers missed shots', () => {
		board.receiveShot(5);
		expect(board.getMissedShotsCells).toEqual([5]);
	});

	test('Check whether all ships are sunk', () => {
		board.placeShip('shipS', 'ver', 21);
		board.receiveShot(2);
		board.receiveShot(3);
		board.receiveShot(4);
		board.receiveShot(21);
		board.receiveShot(31);
		expect(board.checkSunkenShips()).toEqual(true);
	});
});
