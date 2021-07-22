class Player {
	constructor(name, isAI = false, turn = false) {
		this._name = name;
		this._isAI = isAI;
		this._myTurn = turn;
		this._shotCells = [];
	}

	takeShot(cell) {
		if (this._isAI) {
			this._shotCells.push(this.takeRandomShot());
		} else {
			this._shotCells.push(cell);
		}
	}

	takeRandomShot() {
		let random = null;
		while (random === null || this._shotCells.includes(random)) {
			random = Math.floor(Math.random() * 25);
		}
		return random;
	}

	changeTurn() {
		this._myTurn = !this._myTurm;
	}

	get getName() {
		return this._name;
	}

	get getShotCells() {
		return this._shotCells;
	}

	get getMyTurn() {
		return this._myTurn;
	}
}

module.exports = Player;
