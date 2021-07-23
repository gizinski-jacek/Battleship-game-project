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
	computerBoard.placeShip('shipX', 'hor', randomNumber());
	computerBoard.placeShip('shipL', 'hor', randomNumber());
	computerBoard.placeShip('shipM', 'ver', randomNumber());
	computerBoard.placeShip('shipS', 'ver', randomNumber());

	renderGame(humanBoard.getOccupiedCells, computerBoard.getOccupiedCells);
	humanTurn();
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

function humanTurn() {
	const cells = document.querySelectorAll('.cellComp');
	cells.forEach((cell) => {
		cell.addEventListener('click', function click(e) {
			e.currentTarget.classList.add('shot');
			e.currentTarget.removeEventListener('click', click);
			computerBoard.receiveShot(Number(e.currentTarget.id.split('_')[1]));
			if (computerBoard.checkSunkenShips()) {
				alert('You have won!');
			} else {
				computerTurn();
			}
		});
	});
}

function computerTurn() {
	const cells = document.querySelectorAll('.cellPlayer');
	let computerShot = computerPlayer.takeShot(boardSize);
	humanBoard.receiveShot(computerShot);
	cells[computerShot].classList.add('shot');
	if (humanBoard.checkSunkenShips()) {
		alert('You have lost!');
	}
}

function randomNumber() {
	let random;
	return (random = Math.floor(Math.random() * boardSize));
}

setUpGame();
