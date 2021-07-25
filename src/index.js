'use strict';

import Player from './player';
import Board from './board';

let humanBoard;
let humanPlayer;
let computerBoard;
let computerPlayer;

function setUpGame() {
	humanBoard = new Board(false);
	humanPlayer = new Player('Tony', false, true);
	humanBoard.placeShip('shipX', true, 4);
	humanBoard.placeShip('shipL', true, 20);
	humanBoard.placeShip('shipM', false, 50);
	humanBoard.placeShip('shipS', false, 54);

	computerBoard = new Board(true);
	computerPlayer = new Player('EasyAI', true, false);
	computerBoard.placeShip('shipX');
	computerBoard.placeShip('shipL');
	computerBoard.placeShip('shipM');
	computerBoard.placeShip('shipS');

	renderGame(humanBoard.getOccupiedCells, computerBoard.getOccupiedCells);
	humanTurn();
}

function renderGame(cellsPlayer, cellsComp) {
	const player = document.getElementById('playerBoard');
	player.innerHTML = '';
	for (let i = 0; i < 100; i++) {
		let cell = document.createElement('div');
		cell.id = 'p_' + i;
		cell.classList.add('cellPlayer');
		if (cellsPlayer.includes(i)) {
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
		if (cellsComp.includes(i)) {
			cell.classList.add('ship');
		}
		computer.append(cell);
	}
}

function humanTurn() {
	const cells = document.querySelectorAll('.cellComp');
	cells.forEach((cell) => {
		cell.addEventListener('click', function click(e) {
			e.currentTarget.classList.add('shot');
			e.currentTarget.removeEventListener('click', click);
			computerBoard.receiveShot(Number(e.currentTarget.id.split('_')[1]));
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