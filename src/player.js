import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.isTurn = true;
  }

  createShip(length) {
    let ship = new Ship(length);
    this.gameboard.ships.push(ship);
    return ship;
  }

  makeMove(gameboard, row, col) {
    // gameboard to receive the attack
    gameboard.receiveAttack(row, col);
    this.isTurn = false;
  }
}

class Computer {
  constructor() {
    this.gameboard = new Gameboard();
    this.previousAttacks = [];
    this.isTurn = false;
  }

  createShips() {
    let ships = [];
    let ship5 = new Ship(5);
    let ship4 = new Ship(4);
    let ship3 = new Ship(3);
    let ship33 = new Ship(3);
    let ship2 = new Ship(2);
    ships.push(ship5);
    ships.push(ship4);
    ships.push(ship3);
    ships.push(ship33);
    ships.push(ship2);

    for (let ship of Object.values(ships)) {
      let isValidPlacement = false;

      while (!isValidPlacement) {
        let randomRow = Math.floor(Math.random() * 10);
        let randomCol = Math.floor(Math.random() * 10);
        let randomOrientation = Math.floor(Math.random() * 10) % 2;
        if (randomOrientation === 0) {
          randomOrientation = "horizontal";
        } else {
          randomOrientation = "vertical";
        }
        isValidPlacement = this.gameboard.placeShip(
          ship,
          randomRow,
          randomCol,
          randomOrientation
        );

        if (isValidPlacement) {
          break;
        }
      }
    }
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
    this.isTurn = false;
  }

  hasAttackedBefore(row, col) {
    return this.previousAttacks.some(
      (attack) => attack.row === row && attack.col === col
    );
  }
}

export { Player };
export { Computer };
