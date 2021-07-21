const Ship = require('./ship');

const shipTemplate = {
	shipS: {
		name: 'S',
		size: 2,
	},
	shipM: {
		name: 'M',
		size: 3,
	},
	shipL: {
		name: 'L',
		size: 4,
	},
	shipX: {
		name: 'X',
		size: 5,
	},
};

const shipList = [];

class Gameboard {
	constructor() {
		this.occupiedCells = [];
		this.missedShotsCells = [];
	}

	placeShip(shipID, direction, cell) {
		// Add create ship here somehow and add the coords to it
		// Maybe add it to some array of objects containing existing ships
		// To find it then with fn receiveShot() and mark as shot
		let arr = [];
		for (let i = 0; i < shipTemplate[shipID].size; i++) {
			if (direction === 'hor') {
				this.occupiedCells.push(cell + i);
				arr.push(cell + i);
			} else if (direction === 'ver') {
				this.occupiedCells.push(cell + i * 10);
				arr.push(cell + i * 10);
			}
		}
		let newShip = new Ship(shipTemplate[shipID], arr);
		shipList.push(newShip);
	}

	receiveShot(cell) {
		if (this.occupiedCells.includes(cell)) {
			let foundShips = shipList.filter((ship) =>
				ship.getCells.includes(cell)
			);
			foundShips[0].getShot(cell);
		} else {
			this.missedShotsCells.push(cell);
		}
	}
}

module.exports = Gameboard;
