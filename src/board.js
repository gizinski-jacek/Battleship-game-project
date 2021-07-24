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

	placeShip(shipID, isHorizontal, originCell) {
		let newShipCells = [];
		for (let i = 0; i < shipTemplate[shipID].size; i++) {
			if (isHorizontal) {
				newShipCells.push(originCell + i);
			} else {
				newShipCells.push(originCell + i * 10);
			}
		}
		if (!this.checkCollisions(newShipCells, isHorizontal)) {
			return false; // error: collision
		} else {
			this._occupiedCells = this._occupiedCells.concat(newShipCells);
			let newShip = new Ship(shipTemplate[shipID], newShipCells);
			this._shipList.push(newShip);
		}
	}

	checkCollisions(shipCells, isHor) {
		let checkCells = [].concat(shipCells);
		if (isHor) {
			for (let i = 0; i < shipCells.length; i++) {
				if (i === 0) {
					checkCells.push(shipCells[i] - 11);
					checkCells.push(shipCells[i] - 1);
					checkCells.push(shipCells[i] + 9);
				} else if (i === shipCells.length - 1) {
					checkCells.push(shipCells[i] - 9);
					checkCells.push(shipCells[i] + 1);
					checkCells.push(shipCells[i] + 11);
				}
				checkCells.push(shipCells[i] - 10);
				checkCells.push(shipCells[i] + 10);
			}
		} else {
			for (let i = 0; i < shipCells.length; i++) {
				if (i === 0) {
					checkCells.push(shipCells[i] - 11);
					checkCells.push(shipCells[i] - 10);
					checkCells.push(shipCells[i] - 9);
				} else if (i === shipCells.length - 1) {
					checkCells.push(shipCells[i] + 9);
					checkCells.push(shipCells[i] + 10);
					checkCells.push(shipCells[i] + 11);
				}
				checkCells.push(shipCells[i] - 1);
				checkCells.push(shipCells[i] + 1);
			}
		}
		let arrResult = [];
		checkCells.forEach((cell) => {
			arrResult.push(this._occupiedCells.includes(cell));
		});
		let result = arrResult.some((x) => x == true);
		if (result) {
			return false;
		} else {
			return true;
		}
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

	checkSunkenShips() {
		let arr = [];
		this._shipList.forEach((ship) => {
			arr.push(ship.isSunk());
		});
		let result = arr.every((x) => x == true);
		return result;
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
