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
			_shotCells: [],
		});
	});

	test('Correctly created AI player', () => {
		expect(computer).toEqual({
			_name: 'AI',
			_isAI: true,
			_shotCells: [],
		});
	});

	test('Getters return correct values', () => {
		expect(player.getName).toEqual('Mark');
		expect(player.getShotCells).toEqual([]);
	});

	test('Registers taken shots', () => {
		player.takeShot(11);
		expect(player.getShotCells).toEqual([11]);
	});

	test('Testing random AI shot by forcing the random value to be 20% of board size (100cells)', () => {
		jest.spyOn(global.Math, 'random').mockReturnValue(0.25);
		computer.takeShot(100);
		expect(computer.getShotCells).toEqual([25]);
		jest.spyOn(global.Math, 'random').mockRestore();
	});
});
