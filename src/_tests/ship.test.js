const Ship = require('../ship');

describe('Ship Factory functions', () => {
	let ship1;
	test('Creates ship correctly', () => {
		expect((ship1 = new Ship(2, [2, 3]))).toEqual({
			_size: 2,
			_cellsOccupied: [2, 3],
			_hits: [],
		});
	});

	test('Correctly returns size', () => {
		expect(ship1.shipSize).toBe(2);
	});

	test('Correctly returns hits taken', () => {
		expect(ship1.hitsTaken).toEqual([]);
	});

	test('Correctly check whether ship is sunk', () => {
		expect(ship1.isSunk()).toBe(false);
	});

	test('Correctly registers shot and gets sunk', () => {
		ship1.getShot(2);
		expect(ship1.hitsTaken).toEqual([2]);
		ship1.getShot(3);
		expect(ship1.hitsTaken).toEqual([2, 3]);
		expect(ship1.isSunk()).toBe(true);
	});
});
