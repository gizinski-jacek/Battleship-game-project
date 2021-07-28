class Player {
	constructor(isAI = false) {
		this._isAI = isAI;
		this._shotCells = [];
	}

	takeShot(cell) {
		if (this._isAI) {
			let random = null;
			while (!random || this._shotCells.includes(random)) {
				random = Math.floor(Math.random() * cell);
			}
			this._shotCells.push(random);
			return random;
		} else {
			this._shotCells.push(cell);
		}
	}

	get isAI() {
		return this._isAI;
	}

	get shotCells() {
		return this._shotCells;
	}
}

module.exports = Player;
