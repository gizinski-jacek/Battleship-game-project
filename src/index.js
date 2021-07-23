'use strict';

import Player from './player';
import Board from './board';

const boardSize = 100;
let humanBoard;
let humanPlayer;
let computerBoard;
let computerPlayer;

function setUpGame() {
	humanBoard = new Board();
	humanPlayer = new Player('Tony', false, true);
	humanBoard.placeShip('shipX', 'hor', 0);
	humanBoard.placeShip('shipL', 'hor', 20);
	humanBoard.placeShip('shipM', 'ver', 50);
	humanBoard.placeShip('shipS', 'ver', 56);

	computerBoard = new Board();
	computerPlayer = new Player('EasyAI', true, false);
	computerBoard.placeShip('shipX', 'hor', 2);
	computerBoard.placeShip('shipL', 'hor', 22);
	computerBoard.placeShip('shipM', 'ver', 52);
	computerBoard.placeShip('shipS', 'ver', 58);

	renderGame(humanBoard.getOccupiedCells, computerBoard.getOccupiedCells);
	listenForMoves();
}

function renderGame(cellsPlayer, cellsComp) {
	const player = document.getElementById('playerBoard');
	for (let i = 0; i < boardSize; i++) {
		let cell = document.createElement('div');
		cell.id = 'p_' + i;
		cell.classList.add('cellPlayer');
		if (cellsPlayer.includes(i)) {
			cell.classList.add('ship');
		}
		player.append(cell);
	}

	const computer = document.getElementById('computerBoard');
	for (let i = 0; i < boardSize; i++) {
		let cell = document.createElement('div');
		cell.id = 'c_' + i;
		cell.classList.add('cellComp');
		if (cellsComp.includes(i)) {
			cell.classList.add('ship');
		}
		computer.append(cell);
	}
}

function listenForMoves() {
	const cells = document.querySelectorAll('.cellComp');
	cells.forEach((cell) => {
		cell.addEventListener('click', (e) => {
			e.currentTarget.classList.add('shot');
			computerBoard.receiveShot(Number(e.currentTarget.id.split('_')[1]));
			if (computerBoard.checkSunkenShips()) {
				alert('Win');
			} else {
				computerMove();
			}
		});
	});
}

function computerMove() {
	let computerShot = computerPlayer.takeShot(boardSize);
	humanBoard.receiveShot(computerShot);
	document
		.querySelectorAll('.cellPlayer')
		[computerShot].classList.add('shot');
	if (humanBoard.checkSunkenShips()) {
		alert('Game Over');
	}
}

setUpGame();
