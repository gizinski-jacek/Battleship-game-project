'use strict';

import Player from './player';
import Board from './board';

const radioShipType = document.getElementsByName('shipType');
const counters = document.getElementsByTagName('span');
const horizontal = document.getElementById('horizontal');
const start = document.getElementById('start');
const restart = document.getElementById('restart');
const gameboardsDiv = document.querySelector('.gameboards');

let humanGameboard;
let humanPlayer;
let computerGameboard;
let computerPlayer;
let shipType;

start.addEventListener('click', () => {
	const board = document.getElementById('humanBoard');
	let boardClone = board.cloneNode(true);
	board.parentNode.replaceChild(boardClone, board);
	renderComputerBoard();
	startHumanTurn();
});

restart.addEventListener('click', initializeGame);

function resetCounters() {
	for (let i = 0; i < counters.length; i++) {
		counters[i].textContent = i + 1;
	}
}

function reduceAvailableShipCounter(shipID) {
	for (let count of counters) {
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
		renderHumanBoard();
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
					e.target.id.split('_')[1]
				);
			} else {
				alert('Pick a ship to place!');
			}
		});
	});
}

radioShipType.forEach((radio) => {
	radio.addEventListener('click', (e) => {
		shipType = e.target.id;
	});
});

function setUpGame() {
	humanGameboard = new Board(false);
	humanPlayer = new Player(false, true);
	computerGameboard = new Board(true);
	computerPlayer = new Player('EasyAI', true, false);
	computerGameboard.placeShip('Battleship');
	computerGameboard.placeShip('Battlecruiser');
	computerGameboard.placeShip('Destroyer');
	computerGameboard.placeShip('Cruiser');
}

function renderHumanBoard() {
	gameboardsDiv.innerHTML = '';
	const humanBoardDOM = document.createElement('div');
	humanBoardDOM.id = 'humanBoard';
	humanBoardDOM.className = 'board';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.id = 'p_' + i;
		cell.classList.add('cellHuman');
		if (humanGameboard.occupiedBoardCells.includes(i)) {
			cell.classList.add('ship');
		}
		humanBoardDOM.append(cell);
	}
	gameboardsDiv.append(humanBoardDOM);
	playerPlaceShips();
}

function renderComputerBoard() {
	const computerBoardDOM = document.createElement('div');
	computerBoardDOM.id = 'computerBoard';
	computerBoardDOM.className = 'board';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.id = 'c_' + i;
		cell.classList.add('cellComputer');
		if (computerGameboard.occupiedBoardCells.includes(i)) {
			cell.classList.add('ship');
		}
		computerBoardDOM.append(cell);
	}
	gameboardsDiv.append(computerBoardDOM);
}

// Needs refactoring!!
function startHumanTurn() {
	const cellsComputer = document.querySelectorAll('.cellComputer');
	cellsComputer.forEach((cell) => {
		cell.addEventListener('click', function click(e) {
			e.target.classList.add('shot');
			e.target.removeEventListener('click', click);
			let cell = e.target.id.split('_')[1];
			if (computerGameboard.receiveShot(cell)) {
				computerGameboard.receiveShot(cell);
				checkGameState(computerGameboard);
			} else {
				computerGameboard.receiveShot(cell);
				startComputerTurn();
			}
		});
	});
}

function checkGameState(board) {
	if (board.checkWinner()) {
		if (board.isAIBoard) {
			if (confirm('You have won! Play again?')) {
				initializeGame();
			} else {
				endGameNoRestart();
			}
		} else {
			if (confirm('You have lost! Play again?')) {
				initializeGame();
			} else {
				endGameNoRestart();
			}
		}
	}
}

function startComputerTurn() {
	const cellsHuman = document.querySelectorAll('.cellHuman');
	let computerShot;
	do {
		computerShot = computerPlayer.takeShot(100);
		cellsHuman[computerShot].classList.add('shot');
		humanGameboard.receiveShot();
	} while (humanGameboard.receiveShot(computerShot));
	checkGameState(humanGameboard);
}

function endGameNoRestart() {
	const board = document.querySelector('.gameboards');
	let boardClone = board.cloneNode(true);
	board.parentNode.replaceChild(boardClone, board);
}

function initializeGame() {
	setUpGame();
	renderHumanBoard();
	resetCounters();
}

initializeGame();
