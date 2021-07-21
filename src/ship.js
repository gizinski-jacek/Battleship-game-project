class Ship {
	constructor(ship, arr) {
		this.name = ship.name;
		this.size = ship.size;
		this.hits = [];
		this.cellsOccupied = arr;
	}

	isSunk() {
		return JSON.stringify(this.hits) === JSON.stringify(this.cellsOccupied);
	}

	getShot(cell) {
		this.hits.push(cell);
	}

	get getSize() {
		return this.size;
	}
	get getHits() {
		return this.hits;
	}
	get getCellsOccupied() {
		return this.cellsOccupied;
	}
}

module.exports = Ship;
