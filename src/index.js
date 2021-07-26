'use strict';

import Player from './player';
import Board from './board';

const radioShipType = document.getElementsByName('shipType');
const counter = document.querySelectorAll('.counter');
const horizontal = document.getElementById('horizontal');
const start = document.querySelector('.start');

let humanBoard;
let humanPlayer;
let computerBoard;
let computerPlayer;
let shipType = 'Battleship';

start.addEventListener('click', () => {
	const cellPlayer = document.querySelectorAll('.cellPlayer');
	cellPlayer.forEach((cell) => {
		cell.classList.add('disableEvents');
	});
	humanTurn();
});

function attachListeners() {
	const cellPlayer = document.querySelectorAll('.cellPlayer');
	cellPlayer.forEach((cell) => {
		cell.addEventListener('click', (e) => {
			humanBoard.placeShip(
				shipType,
				horizontal.checked,
				e.currentTarget.id.split('_')[1]
			);
			counter.forEach((count) => {
				if (
					count.classList.contains(shipType) &&
					count.textContent > 0
				) {
					count.textContent = count.textContent - 1;
					if (count.textContent <= 0) {
						document.getElementById(shipType).checked = false;
						document
							.getElementById(shipType)
							.setAttribute('disabled', true);
						shipType = null;
					}
				}
			});
			renderGame();
		});
	});
}

radioShipType.forEach((radio) => {
	radio.addEventListener('click', (e) => {
		shipType = e.currentTarget.id;
	});
});

function setUpGame() {
	humanBoard = new Board(false);
	humanPlayer = new Player('Tony', false, true);

	computerBoard = new Board(true);
	computerPlayer = new Player('EasyAI', true, false);
	computerBoard.placeShip('Battleship');
	computerBoard.placeShip('Battlecruiser');
	computerBoard.placeShip('Destroyer');
	computerBoard.placeShip('Cruiser');

	renderGame();
}

function renderGame() {
	const player = document.getElementById('playerBoard');
	player.innerHTML = '';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.id = 'p_' + i;
		cell.classList.add('cellPlayer');
		if (humanBoard.getOccupiedCells.includes(i)) {
			cell.classList.add('ship');
		}
		player.append(cell);
	}

	const computer = document.getElementById('computerBoard');
	computer.innerHTML = '';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.id = 'c_' + i;
		cell.classList.add('cellComp');
		if (computerBoard.getOccupiedCells.includes(i)) {
			cell.classList.add('ship');
		}
		computer.append(cell);
	}
	attachListeners();
}

function humanTurn() {
	const cells = document.querySelectorAll('.cellComp');
	cells.forEach((cell) => {
		cell.addEventListener('click', function click(e) {
			e.currentTarget.classList.add('shot');
			e.currentTarget.removeEventListener('click', click);
			computerBoard.receiveShot(e.currentTarget.id.split('_')[1]);
			if (computerBoard.checkSunkenShips()) {
				if (confirm('You have won! Play again?')) {
					setUpGame();
				}
			} else {
				computerTurn();
			}
		});
	});
}

function computerTurn() {
	const cells = document.querySelectorAll('.cellPlayer');
	let computerShot = computerPlayer.takeShot(100);
	humanBoard.receiveShot(computerShot);
	cells[computerShot].classList.add('shot');
	if (humanBoard.checkSunkenShips()) {
		if (confirm('You have lost! Play again?')) {
			setUpGame();
		}
	}
}

setUpGame();
