import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.isTurn = true;
  }

  createShip(length) {
    ship = new Ship(length);
    this.gameboard.ships.push(ship);
    return ship;
  }

  makeMove(gameboard, row, col) {
    // gameboard to receive the attack
    gameboard.receiveAttack(row, col);
  }
}

class Computer {
  constructor() {
    this.gameboard = new Gameboard();
    this.previousAttacks = [];
    this.isTurn = false;
  }

  makeMove(gameboard) {
    let randomRow = Math.floor(Math.random() * 10);
    let randomCol = Math.floor(Math.random() * 10);

    while (this.hasAttackedBefore(randomRow, randomCol)) {
      randomRow = Math.floor(Math.random() * 10);
      randomCol = Math.floor(Math.random() * 10);
    }

    gameboard.receiveAttack(randomRow, randomCol);

    this.previousAttacks.push({ randomRow, randomCol });
  }

  hasAttackedBefore(row, col) {
    return this.previousAttacks.some(
      (attack) => attack.row === row && attack.col === col
    );
  }
}

export { Player };
export { Computer };
