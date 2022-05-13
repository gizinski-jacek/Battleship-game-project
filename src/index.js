'use strict';

import Player from './player';
import Board from './board';

const shipTypes = document.getElementsByName('shipType');
const horizontal = document.getElementById('horizontal');
const start = document.getElementById('start');
const restart = document.getElementById('restart');
const shipControls = document.querySelector('.shipControls');
const gameboardsDiv = document.querySelector('.gameboards');

let humanGameboard;
let humanPlayer;
let computerGameboard;
let computerPlayer;
let gameStarted = false;
let shipLength = document.querySelector('input[name=shipType]:checked').value;

start.addEventListener('click', startGame);

function startGame() {
	if (humanGameboard.shipList.length !== shipTypes.length) {
		alert('You have some ships left to place!');
		return;
	}
	if (!gameStarted) {
		gameStarted = true;
		const board = document.getElementById('humanBoard');
		const boardClone = board.cloneNode(true);
		board.parentNode.replaceChild(boardClone, board);
		shipControls.style.display = 'none';
		toggleShipMenu();
		placeComputerShips();
		renderComputerBoard();
		startHumanTurn();
	}
}

restart.addEventListener('click', restartGame);

function restartGame() {
	gameStarted = false;
	shipControls.style.display = 'flex';
	toggleShipMenu();
	initializeGame();
}

shipTypes.forEach((radio) => {
	radio.addEventListener('click', (e) => {
		shipLength = e.target.value;
	});
});

function toggleShipMenu() {
	const radios = document.querySelectorAll('input[name=shipType]');
	for (let i = 0; i < radios.length; i++) {
		radios[i].checked = false;
		radios[i].disabled = gameStarted;
		horizontal.disabled = gameStarted;
		shipLength = null;
	}
	if (!gameStarted) {
		radios[0].checked = true;
		radios[0].disabled = gameStarted;
		horizontal.checked = true;
		shipLength = radios[0].value;
	}
}

function nextShipOption() {
	for (let [index, radio] of shipTypes.entries()) {
		if (radio.checked && !radio.disabled) {
			radio.checked = false;
			radio.disabled = true;
			const disRads = document.querySelectorAll(
				'input[name=shipType]:disabled'
			);
			if (disRads.length === shipTypes.length) {
				shipLength = null;
				break;
			} else {
				do {
					index++;
					if (index >= shipTypes.length) {
						index = 0;
					}
				} while (shipTypes[index].disabled);
				shipTypes[index].checked = true;
				shipLength = shipTypes[index].value;
				break;
			}
		}
	}
}

function attemptShipPlacement(size, dir, cell) {
	if (size) {
		if (humanGameboard.placeShip(size, dir, cell)) {
			nextShipOption();
			renderHumanBoard();
			let array = Array.from(shipTypes);
			if (array.every((ship) => ship.disabled == true)) {
				startGame();
			}
		} else {
			alert('Incorrect ship placement!');
		}
	} else {
		alert('Pick a ship to place!');
	}
}

function listenForShipPlacement() {
	const cellHuman = document.querySelectorAll('.cellHuman');
	cellHuman.forEach((cell, index) => {
		cell.addEventListener('click', () => {
			attemptShipPlacement(shipLength, horizontal.checked, index);
		});
	});
}

function hoverShowShip() {
	const cellHuman = document.querySelectorAll('.cellHuman');
	cellHuman.forEach((cell, index) => {
		cell.addEventListener('mouseenter', () => {
			if (shipLength) {
				if (horizontal.checked) {
					let shipCells = humanGameboard.calculateShipPlacement(
						shipLength,
						horizontal.checked,
						index
					);
					shipCells = shipCells.filter((x) => x < 100);
					shipCells.forEach((cell) => {
						cellHuman[cell].classList.add('hoverShip');
					});
				} else {
					let shipCells = humanGameboard.calculateShipPlacement(
						shipLength,
						horizontal.checked,
						index
					);
					shipCells = shipCells.filter((x) => x < 100);
					shipCells.forEach((cell) => {
						cellHuman[cell].classList.add('hoverShip');
					});
				}
			}
		});
		cell.addEventListener('mouseleave', () => {
			cellHuman.forEach((cell) => {
				cell.classList.remove('hoverShip');
			});
		});
	});
}

function setUpGame() {
	humanGameboard = new Board(false);
	humanPlayer = new Player(false);
	computerGameboard = new Board(true);
	computerPlayer = new Player(true);
}

function renderHumanBoard() {
	gameboardsDiv.innerHTML = '';
	const container = document.createElement('div');
	container.className = 'container';
	const humanBoardDOM = document.createElement('div');
	humanBoardDOM.id = 'humanBoard';
	humanBoardDOM.className = 'board';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.classList.add('cellHuman');
		if (humanGameboard.occupiedBoardCells.includes(i)) {
			cell.classList.add('ship');
		}
		humanBoardDOM.append(cell);
	}

	const boardTitle = document.createElement('span');
	boardTitle.textContent = 'Your Board';

	container.appendChild(boardTitle);
	container.append(humanBoardDOM);
	gameboardsDiv.appendChild(container);
	listenForShipPlacement();
	hoverShowShip();
}

function placeComputerShips() {
	shipTypes.forEach((ship) => {
		let i = 0;
		let shipDirection;
		let shipPlacement;
		do {
			shipDirection = computerGameboard.randomNumber(2);
			shipPlacement = computerGameboard.randomNumber(100);
			if (
				computerGameboard.placeShip(ship.value, shipDirection, shipPlacement)
			) {
				break;
			}
			i++;
		} while (
			!computerGameboard.placeShip(ship.value, shipDirection, shipPlacement) ||
			i < 100
		);
	});
}

function renderComputerBoard() {
	const container = document.createElement('div');
	container.className = 'container';
	const computerBoardDOM = document.createElement('div');
	computerBoardDOM.id = 'computerBoard';
	computerBoardDOM.className = 'board';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.classList.add('cellComputer');
		computerBoardDOM.append(cell);
	}
	const boardTitle = document.createElement('span');
	boardTitle.textContent = 'Enemy Board';

	container.appendChild(boardTitle);
	container.append(computerBoardDOM);
	gameboardsDiv.appendChild(container);
}

function startHumanTurn() {
	const cellsComputer = document.querySelectorAll('.cellComputer');
	cellsComputer.forEach((cell, index) => {
		cell.addEventListener('click', function humanShot(e) {
			e.target.classList.add('shot');
			e.target.removeEventListener('click', humanShot);
			if (computerGameboard.receiveShot(index)) {
				cell.classList.add('ship');
			}
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
