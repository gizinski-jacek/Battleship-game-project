class Ship {
	constructor(ship, array) {
		this._name = ship.name;
		this._size = ship.size;
		this._cellsOccupied = array;
		this._hits = [];
	}

	isSunk() {
		return this._cellsOccupied.every((cell) => this._hits.includes(cell));
	}

	getShot(cell) {
		this._hits.push(cell);
	}

	get shipSize() {
		return this._size;
	}

	get hitsTaken() {
		return this._hits;
	}

	get cellsOccupied() {
		return this._cellsOccupied;
	}
}

module.exports = Ship;
