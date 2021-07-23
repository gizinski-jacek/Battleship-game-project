class Player {
	constructor(name, isAI = false) {
		this._name = name;
		this._isAI = isAI;
		this._shotCells = [];
	}

	takeShot(cell) {
		if (this._isAI) {
			let random = null;
			while (random === null || this._shotCells.includes(random)) {
				random = Math.floor(Math.random() * cell);
			}
			this._shotCells.push(random);
			return random;
		} else {
			this._shotCells.push(cell);
		}
	}

	get getName() {
		return this._name;
	}

	get getShotCells() {
		return this._shotCells;
	}
}

module.exports = Player;
