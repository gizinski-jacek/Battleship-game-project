class Ship {
	constructor(ship, arr) {
		this._name = ship.name;
		this._size = ship.size;
		this._cellsOccupied = arr;
		this._hits = [];
	}

	isSunk() {
		let sortHits = this._hits.sort((a, b) => {
			return a - b;
		});
		return JSON.stringify(this._cellsOccupied) === JSON.stringify(sortHits);
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
