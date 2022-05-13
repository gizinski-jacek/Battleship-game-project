const Ship = require('./ship');

// Array of numbers from 0 to 9
const arrayRange = Array.from({ length: 10 }, (x, y) => y);

// Array of first column cells.
// Used for ship collision checks.
const firstColumnCells = arrayRange.map((x) => x * 10);

// Same as above but array of last column cells.
const lastColumnCells = firstColumnCells.map((x) => x + 9);

class Gameboard {
	constructor() {
		this._shipList = [];
		this._occupiedBoardCells = [];
		this._missedShotsCells = [];
	}

	randomNumber(range) {
		return Math.floor(Math.random() * range);
	}

	placeShip(shipSize, isHorizontal, startingCell) {
		if (this._occupiedBoardCells.includes(startingCell)) {
			return false;
		}
		shipSize = Number(shipSize);
		startingCell = Number(startingCell);
		const newShipCells = this.calculateShipPlacement(
			shipSize,
			isHorizontal,
			startingCell
		);
		if (
			this.checkWallCollisions(newShipCells, isHorizontal) &&
			this.checkShipCollisions(newShipCells, isHorizontal)
		) {
			this._occupiedBoardCells = this._occupiedBoardCells.concat(newShipCells);
			const newShip = new Ship(shipSize, newShipCells);
			this._shipList.push(newShip);
			return true;
		} else {
			return false;
		}
	}

	calculateShipPlacement(size, isHor, firstCell) {
		const cells = [];
		for (let i = 0; i < size; i++) {
			if (isHor) {
				cells.push(firstCell + i);
			} else {
				cells.push(firstCell + i * 10);
			}
		}
		return cells;
	}

	checkWallCollisions(shipCells, isHor) {
		let wallCollisions = undefined;
		if (isHor && wallCollisions === undefined) {
			let testCells = shipCells.slice(1);
			for (let i = 1; i < 11; i++) {
				for (const cell of testCells) {
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
			return true;
		} else {
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
					checkCells.push(shipCells[i] - 10);
				} else if (i === shipCells.length - 1) {
					checkCells.push(shipCells[i] + 10);
				}
				if (!firstColumnCells.includes(shipCells[i])) {
					checkCells.push(shipCells[i] + 9);
					checkCells.push(shipCells[i] - 1);
					checkCells.push(shipCells[i] - 11);
				}
				if (!lastColumnCells.includes(shipCells[i])) {
					checkCells.push(shipCells[i] + 1);
					checkCells.push(shipCells[i] + 11);
					checkCells.push(shipCells[i] - 9);
				}
			}
		}
		let shipCollisions = undefined;
		for (const cell of checkCells) {
			if (this._occupiedBoardCells.includes(cell)) {
				shipCollisions = true;
				break;
			}
		}

		if (!shipCollisions) {
			return true;
		} else {
			return false;
		}
	}

	receiveShot(cell) {
		cell = Number(cell);
		if (this._occupiedBoardCells.includes(cell)) {
			const targetShip = this._shipList.find((ship) =>
				ship.cellsOccupied.includes(cell)
			);
			targetShip.getShot(cell);
			return true;
		} else {
			this._missedShotsCells.push(cell);
			return false;
		}
	}

	checkAllShipStatus() {
		return this._shipList.every((ship) => ship.isSunk());
	}

	get shipList() {
		return this._shipList;
	}

	get occupiedBoardCells() {
		return this._occupiedBoardCells;
	}

	get missedShotsCells() {
		return this._missedShotsCells;
	}
}

module.exports = Gameboard;
