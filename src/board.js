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

// Array of numbers from 1 to 9
const arrayRange = Array.from({ length: 10 }, (x, y) => y);

// Used to check whether ships first cell starts on a cell in first column.
// It it does then it doesn't add unnecessary numbers to array for later ship collision checks.
const firstColumnCells = arrayRange.map((x) => x * 10);

// Same as above but for last column instead.
const lastColumnCells = firstColumnCells.map((x) => x + 9);

class Gameboard {
	constructor(isAIBoard = false) {
		this._occupiedCells = [];
		this._missedShotsCells = [];
		this._shipList = [];
		this._isAIBoard = isAIBoard;
	}

	placeShip(shipID, isHorizontal, originCell) {
		if (this._isAIBoard) {
			isHorizontal = this.randomNumber(2);
			originCell = this.randomNumber(100);
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
			this.checkWallCollisions(newShipCells, isHorizontal) &&
			this.checkShipCollisions(newShipCells, isHorizontal)
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

	checkWallCollisions(shipCells, isHor) {
		let wallCollisions = undefined;
		if (isHor && wallCollisions === undefined) {
			let testCells = shipCells.slice(1);
			for (let i = 1; i < 11; i++) {
				for (let cell of testCells) {
					if (cell === 11 * i - i) {
						wallCollisions = true;
						break;
					}
				}
				if (wallCollisions) {
					break;
				}
			}
		} else {
			if (shipCells[shipCells.length - 1] > 99) {
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

	checkShipCollisions(shipCells, isHor) {
		let checkCells = [].concat(shipCells);
		if (isHor) {
			for (let i = 0; i < shipCells.length; i++) {
				if (i === 0 && !firstColumnCells.includes(shipCells[0])) {
					checkCells.push(shipCells[i] - 11);
					checkCells.push(shipCells[i] - 1);
					checkCells.push(shipCells[i] + 9);
				} else if (
					i === shipCells.length - 1 &&
					!lastColumnCells.includes(shipCells[shipCells.length - 1])
				) {
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
		let shipCollisions = undefined;
		for (let cell of checkCells) {
			if (this._occupiedCells.includes(cell)) {
				shipCollisions = true;
				break;
			}
		}

		if (!shipCollisions) {
			// No collision found
			return true;
		} else {
			// Collision found
			return false;
		}
	}

	randomNumber(range) {
		return Math.floor(Math.random() * range);
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
