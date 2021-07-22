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

class Gameboard {
	constructor() {
		this._occupiedCells = [];
		this._missedShotsCells = [];
		this._shipList = [];
	}

	placeShip(shipID, direction, cell) {
		let arr = [];
		for (let i = 0; i < shipTemplate[shipID].size; i++) {
			if (direction === 'hor') {
				this._occupiedCells.push(cell + i);
				arr.push(cell + i);
			} else if (direction === 'ver') {
				this._occupiedCells.push(cell + i * 10);
				arr.push(cell + i * 10);
			}
		}
		let newShip = new Ship(shipTemplate[shipID], arr);
		this._shipList.push(newShip);
	}

	receiveShot(cell) {
		if (this._occupiedCells.includes(cell)) {
			let foundShips = this._shipList.filter((ship) =>
				ship.getCellsOccupied.includes(cell)
			);
			foundShips[0].getShot(cell);
		} else {
			this._missedShotsCells.push(cell);
		}
	}

	get getOccupiedCells() {
		return this._occupiedCells;
	}

	get getMissedShotsCells() {
		return this._missedShotsCells;
	}

	get getShipList() {
		return this._shipList;
	}
}

module.exports = Gameboard;
