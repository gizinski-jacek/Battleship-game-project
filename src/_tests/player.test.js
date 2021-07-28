const Player = require('../player');

describe('Player Factory functions', () => {
	let human;
	let computer;

	beforeEach(() => {
		human = new Player();
		computer = new Player(true);
	});

	test('Correctly created human player', () => {
		expect(human).toEqual({
			_isAI: false,
			_shotCells: [],
		});
	});

	test('Correctly created AI player', () => {
		expect(computer).toEqual({
			_isAI: true,
			_shotCells: [],
		});
	});

	test('Getters return correct values', () => {
		expect(human.isAI).toEqual(false);
		expect(computer.isAI).toEqual(true);
		expect(human.shotCells).toEqual([]);
	});

	test('Registers taken shots', () => {
		human.takeShot(11);
		expect(human.shotCells).toEqual([11]);
	});

	test(`Testing random AI shot by forcing the random 
	value to be 25`, () => {
		jest.spyOn(global.Math, 'random').mockReturnValue(0.25);
		computer.takeShot(100);
		expect(computer.shotCells).toEqual([25]);
		jest.spyOn(global.Math, 'random').mockRestore();
	});
});
