const Player = require('../player');

describe('Player Factory functions', () => {
	let player;
	let computer;

	beforeEach(() => {
		player = new Player('Mark');
		computer = new Player('AI', true);
	});

	test('Correctly created human player', () => {
		expect(player).toEqual({
			_name: 'Mark',
			_isAI: false,
			_myTurn: false,
			_shotCells: [],
		});
	});

	test('Correctly created AI player', () => {
		expect(computer).toEqual({
			_name: 'AI',
			_isAI: true,
			_myTurn: false,
			_shotCells: [],
		});
	});

	test('Getters return correct values', () => {
		expect(player.getName).toEqual('Mark');
		expect(player.getShotCells).toEqual([]);
		expect(player.getMyTurn).toEqual(false);
	});

	test('Changes players turn correctly', () => {
		player.changeTurn();
		expect(player.getMyTurn).toEqual(true);
	});

	test('Registers taken shots', () => {
		player.takeShot(11);
		expect(player.getShotCells).toEqual([11]);
	});

	// Two ways I came up with to test random AI shots. In the end I will probably go with the second one.
	test('Testing random AI shot by leaving only available shot to be 24', () => {
		computer._shotCells = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 11, 13, 14, 15, 16, 17, 18,
			19, 20, 21, 22, 23,
		];
		computer.takeShot();
		expect(computer.getShotCells).toEqual([
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 11, 13, 14, 15, 16, 17, 18,
			19, 20, 21, 22, 23, 24,
		]);
	});

	test('Testing random AI shot by forcing the random value to be 20% of board size (25cells atm)', () => {
		jest.spyOn(global.Math, 'random').mockReturnValue(0.2);
		computer.takeShot();
		expect(computer.getShotCells).toEqual([5]);
		jest.spyOn(global.Math, 'random').mockRestore();
	});
});
