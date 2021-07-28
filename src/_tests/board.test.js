const Gameboard = require('../board');

describe('Gameboard Factory functions', () => {
	let humanBoard;

	beforeEach(() => {
		humanBoard = new Gameboard();
		humanBoard.placeShip('Destroyer', true, 2);
	});

	test('Getters return correct values', () => {
		expect(humanBoard.isAIBoard).toEqual(false);
		expect(humanBoard.shipList).toEqual([
			{
				_name: 'Destroyer',
				_size: 3,
				_hits: [],
				_cellsOccupied: [2, 3, 4],
			},
		]);
		expect(humanBoard.occupiedBoardCells).toEqual([2, 3, 4]);
		expect(humanBoard.missedShotsCells).toEqual([]);
	});

	test('Correctly created board and placed 3 tile big ship', () => {
		expect(humanBoard.occupiedBoardCells).toEqual([2, 3, 4]);
	});

	test('Correctly placed additional 2 tile big vertical ship', () => {
		humanBoard.placeShip('Cruiser', false, 21);
		expect(humanBoard.occupiedBoardCells).toEqual([2, 3, 4, 21, 31]);
	});

	test.only(`Prevented placing ship that collided or bordered with 
	already existing ship`, () => {
		expect(humanBoard.placeShip('Cruiser', false, 12)).toEqual(false);
	});

	test('Prevented placing ship that collided with wall', () => {
		expect(humanBoard.placeShip('Destroyer', true, 29)).toEqual(false);
	});

	test('Registers missed shots', () => {
		humanBoard.receiveShot(5);
		expect(humanBoard.missedShotsCells).toEqual([5]);
	});

	test('Check whether all ships are sunk', () => {
		humanBoard.placeShip('Cruiser', false, 21);
		humanBoard.receiveShot(2);
		humanBoard.receiveShot(3);
		humanBoard.receiveShot(4);
		humanBoard.receiveShot(21);
		humanBoard.receiveShot(31);
		expect(humanBoard.checkWinner()).toEqual(true);
	});

	test(`Testing random ship placement by forcing the random starting 
	position to be 35 and direction to be horizontal (true)`, () => {
		jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
		let computerBoard = new Gameboard(true);
		computerBoard.placeShip('Battlecruiser', true);
		expect(computerBoard.occupiedBoardCells).toEqual([60, 61, 62, 63]);
		jest.spyOn(global.Math, 'random').mockRestore();
	});
});
