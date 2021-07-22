class Ship {
	constructor(ship, arr) {
		this._name = ship.name;
		this._size = ship.size;
		this._hits = [];
		this._cellsOccupied = arr;
	}

	isSunk() {
		return (
			JSON.stringify(this._hits) === JSON.stringify(this._cellsOccupied)
		);
	}

	getShot(cell) {
		this._hits.push(cell);
	}

	get getSize() {
		return this._size;
	}

	get getHits() {
		return this._hits;
	}

	get getCellsOccupied() {
		return this._cellsOccupied;
	}
}

module.exports = Ship;
