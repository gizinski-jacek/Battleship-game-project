'use strict';

import Player from './player';
import Board from './board';

const radioShipType = document.getElementsByName('shipType');
const counter = document.getElementsByTagName('span');
const horizontal = document.getElementById('horizontal');
const start = document.getElementById('start');

let humanBoardDOM = document.getElementById('humanBoard');
let computerBoardDOM = document.getElementById('computerBoard');

let humanGameboard;
let humanPlayer;
let computerGameboard;
let computerPlayer;
let shipType;

start.addEventListener('click', () => {
	const cellHuman = document.querySelectorAll('.cellHuman');
	cellHuman.forEach((cell) => {
		cell.classList.add('disableEvents');
	});
	startHumanTurn();
});

function reduceAvailableShipCounter(shipID) {
	for (let count of counter) {
		if (count.className === shipID && count.textContent > 0) {
			count.textContent = count.textContent - 1;
			if (count.textContent <= 0) {
				document.getElementById(shipID).checked = false;
				document.getElementById(shipID).setAttribute('disabled', true);
				shipType = null;
			}
		}
	}
}

function attemptShipPlacement(id, dir, cell) {
	if (humanGameboard.placeShip(id, dir, cell)) {
		humanGameboard.placeShip(id, dir, cell);
		reduceAvailableShipCounter(id);
		renderGame();
	} else {
		alert('Incorrect ship placement!');
	}
}

function playerPlaceShips() {
	const cellHuman = document.querySelectorAll('.cellHuman');
	cellHuman.forEach((cell) => {
		cell.addEventListener('click', (e) => {
			if (shipType) {
				attemptShipPlacement(
					shipType,
					horizontal.checked,
					e.currentTarget.id.split('_')[1]
				);
			} else {
				alert('Pick a ship to place!');
			}
		});
	});
}

radioShipType.forEach((radio) => {
	radio.addEventListener('click', (e) => {
		shipType = e.currentTarget.id;
	});
});

function setUpGame() {
	humanGameboard = new Board(false);
	humanPlayer = new Player('Tony', false, true);

	computerGameboard = new Board(true);
	computerPlayer = new Player('EasyAI', true, false);

	computerGameboard.placeShip('Battleship');
	computerGameboard.placeShip('Battlecruiser');
	computerGameboard.placeShip('Destroyer');
	computerGameboard.placeShip('Cruiser');

	renderGame();
}

function renderGame() {
	humanBoardDOM.innerHTML = '';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.id = 'p_' + i;
		cell.classList.add('cellHuman');
		if (humanGameboard.getOccupiedCells.includes(i)) {
			cell.classList.add('ship');
		}
		humanBoardDOM.append(cell);
	}

	computerBoardDOM.innerHTML = '';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.id = 'c_' + i;
		cell.classList.add('cellComputer');
		if (computerGameboard.getOccupiedCells.includes(i)) {
			cell.classList.add('ship');
		}
		computerBoardDOM.append(cell);
	}
	playerPlaceShips();
}

// Needs refactoring!!
function startHumanTurn() {
	const cellsComputer = document.querySelectorAll('.cellComputer');
	cellsComputer.forEach((cell) => {
		cell.addEventListener('click', function click(e) {
			console.log(cellsComputer);
			console.log(e.currentTarget);
			e.currentTarget.classList.add('shot');
			e.currentTarget.removeEventListener('click', click);
			if (
				computerGameboard.receiveShot(e.currentTarget.id.split('_')[1])
			) {
				computerGameboard.receiveShot(e.currentTarget.id.split('_')[1]);
			} else {
				computerGameboard.receiveShot(e.currentTarget.id.split('_')[1]);
				startComputerTurn();
			}
		});
	});
}

function startComputerTurn() {
	if (computerGameboard.checkWinner()) {
		if (confirm('You have won! Play again?')) {
			setUpGame();
		}
	} else {
		const cellsHuman = document.querySelectorAll('.cellHuman');
		let computerShot;
		do {
			computerShot = computerPlayer.takeShot(100);
			cellsHuman[computerShot].classList.add('shot');
			humanGameboard.receiveShot(computerShot);
		} while (humanGameboard.receiveShot(computerShot));
	}
	if (humanGameboard.checkWinner()) {
		if (confirm('You have lost! Play again?')) {
			setUpGame();
		}
	}
}

setUpGame();
