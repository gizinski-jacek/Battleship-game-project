class Ship {
	constructor(size, position) {
		this._size = size;
		this._cellsOccupied = position;
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
