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
	constructor(isAIBoard = false) {
		this._occupiedCells = [];
		this._missedShotsCells = [];
		this._shipList = [];
		this._isAIBoard = isAIBoard;
	}

	placeShip(shipID, isHorizontal, originCell) {
		if (this._isAIBoard) {
			originCell = this.randomNumber();
		}
		let newShipCells = [];
		for (let i = 0; i < shipTemplate[shipID].size; i++) {
			if (isHorizontal) {
				newShipCells.push(originCell + i);
			} else {
				newShipCells.push(originCell + i * 10);
			}
		}
		if (
			this.checkShipCollisions(newShipCells, isHorizontal) &&
			this.checkWallCollisions(newShipCells, isHorizontal)
		) {
			// No collision, continue
			this._occupiedCells = this._occupiedCells.concat(newShipCells);
			let newShip = new Ship(shipTemplate[shipID], newShipCells);
			this._shipList.push(newShip);
		} else {
			// Error: collision

			return false;
		}
	}

	checkShipCollisions(shipCells, isHor) {
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

		let arrShipCollisions = [];
		checkCells.forEach((cell) => {
			arrShipCollisions.push(this._occupiedCells.includes(cell));
		});
		let shipCollisions = arrShipCollisions.some((x) => x == true);

		if (!shipCollisions) {
			// No collisions found
			return true;
		} else {
			// Collisions found
			console.log('ship collision');
			return false;
		}
	}

	checkWallCollisions(shipCells, isHor) {
		let lastShipCell = shipCells[shipCells.length - 1];
		let wallCollisions;
		if (isHor) {
			for (let i = 1; i <= 10; i++) {
				if (lastShipCell === 11 * i - i) {
					console.log('out of right side bounds');
					wallCollisions = true;
				}
			}
		} else {
			if (lastShipCell >= 100) {
				console.log('out of bottom side bounds');
				wallCollisions = true;
			}
		}

		if (!wallCollisions) {
			// No collisions found
			return true;
		} else {
			// Collisions found
			return false;
		}
	}

	randomNumber() {
		return Math.floor(Math.random() * 100);
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

	get isAIBoard() {
		return this._isAIBoard;
	}
}

module.exports = Gameboard;
