'use strict';

import Player from './player';
import Board from './board';

const radioShipType = document.getElementsByName('shipType');
const horizontal = document.getElementById('horizontal');
const start = document.getElementById('start');
const restart = document.getElementById('restart');
const shipControls = document.querySelector('.shipControls');

let humanGameboard;
let humanPlayer;
let computerGameboard;
let computerPlayer;
let shipLength;
let gameStarted;

start.addEventListener('click', startGame);

function startGame() {
	if (!gameStarted) {
		gameStarted = true;
		const board = document.getElementById('humanBoard');
		let boardClone = board.cloneNode(true);
		board.parentNode.replaceChild(boardClone, board);
		shipControls.style.display = 'none';
		horizontal.disabled = gameStarted;
		toggleShipSelect();
		placeComputerShips();
		renderComputerBoard();
		startHumanTurn();
	}
}

restart.addEventListener('click', restartGame);

function restartGame() {
	gameStarted = false;
	shipControls.style.display = 'flex';
	toggleShipSelect();
	initializeGame();
}

radioShipType.forEach((radio) => {
	radio.addEventListener('click', (e) => {
		shipLength = e.target.value;
	});
});

function toggleShipSelect() {
	const radios = document.querySelectorAll('input[name=shipType]');
	for (let i = 0; i < radios.length; i++) {
		radios[i].checked = false;
		radios[i].disabled = gameStarted;
		horizontal.checked = true;
		horizontal.disabled = gameStarted;
	}
}

function disableShipPick() {
	radioShipType.forEach((radio) => {
		if (radio.checked) {
			radio.checked = false;
			radio.setAttribute('disabled', true);
			shipLength = null;
		}
	});
}

function attemptShipPlacement(size, dir, cell) {
	if (size) {
		if (humanGameboard.placeShip(size, dir, cell)) {
			disableShipPick();
			renderHumanBoard();
		} else {
			alert('Incorrect ship placement!');
		}
	} else {
		alert('Pick a ship to place!');
	}
}

function listenForShipPlacement() {
	const cellHuman = document.querySelectorAll('.cellHuman');
	cellHuman.forEach((cell) => {
		cell.addEventListener('click', (e) => {
			attemptShipPlacement(
				shipLength,
				horizontal.checked,
				e.target.id.split('_')[1]
			);
		});
	});
}

//////////////////////////////////////////////
// ToDo: Show shadow of a ship player wants //
// to place when hovering over board				//
//////////////////////////////////////////////

function setUpGame() {
	humanGameboard = new Board(false);
	humanPlayer = new Player(false, true);
	computerGameboard = new Board(true);
	computerPlayer = new Player('EasyAI', true, false);
}

function renderHumanBoard() {
	const gameboardsDiv = document.querySelector('.gameboards');
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
	listenForShipPlacement();
}

function placeComputerShips() {
	radioShipType.forEach((ship) => {
		let shipDirection;
		let shipPlacement;
		do {
			shipDirection = computerGameboard.randomNumber(2);
			shipPlacement = computerGameboard.randomNumber(100);
			if (
				computerGameboard.placeShip(
					ship.value,
					shipDirection,
					shipPlacement
				)
			) {
				break;
			}
		} while (
			!computerGameboard.placeShip(
				ship.value,
				shipDirection,
				shipPlacement
			)
		);
	});
}

function renderComputerBoard() {
	const gameboardsDiv = document.querySelector('.gameboards');
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

function startHumanTurn() {
	const cellsComputer = document.querySelectorAll('.cellComputer');
	cellsComputer.forEach((cell) => {
		cell.addEventListener('click', function click(e) {
			e.target.classList.add('shot');
			e.target.removeEventListener('click', click);
			let cell = e.target.id.split('_')[1];
			computerGameboard.receiveShot(cell);
			if (computerGameboard.checkAllShipStatus()) {
				if (confirm('You have won! Play again?')) {
					restartGame();
				} else {
					endGameNoRestart();
				}
			} else {
				startComputerTurn();
			}
		});
	});
}

function startComputerTurn() {
	const cellsHuman = document.querySelectorAll('.cellHuman');
	let computerShot = computerPlayer.takeShot(100);
	cellsHuman[computerShot].classList.add('shot');
	humanGameboard.receiveShot();
	if (humanGameboard.checkAllShipStatus()) {
		if (confirm('You have lost! Play again?')) {
			restartGame();
		} else {
			endGameNoRestart();
		}
	}
}

function endGameNoRestart() {
	const board = document.querySelector('.gameboards');
	let boardClone = board.cloneNode(true);
	board.parentNode.replaceChild(boardClone, board);
}

function initializeGame() {
	setUpGame();
	renderHumanBoard();
}

initializeGame();
