import { Ship } from "./ship";

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(""));
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, row, col, orientation) {
    if (this.isValidPlacement(ship, row, col, orientation)) {
      for (let i = 0; i < ship.length; i++) {
        if (orientation === "horizontal") {
          this.board[row][col + i] = ship;
        } else {
          this.board[row + i][col] = ship;
        }
      }
      this.ships.push({ ship, row, col, orientation });
      return true;
    }

    return false;
  }

  isValidPlacement(ship, row, col, orientation) {
    if (
      (orientation === "horizontal" && col + ship.length > 10) ||
      (orientation === "vertical" && row + ship.length > 10)
    ) {
      return false;
    }

    for (let i = 0; i < ship.length; i++) {
      if (orientation === "horizontal" && this.board[row][col + i] != "")
        return false;
      else if (orientation === "vertical" && this.board[row + i][col] != "")
        return false;
    }

    return true;
  }

  receiveAttack(row, col) {
    for (const shipInfo of this.ships) {
      const { ship, row: shipRow, col: shipCol, orientation } = shipInfo;

      if (
        (orientation === "horizontal" &&
          row === shipRow &&
          col >= shipCol &&
          col < shipCol + ship.length) ||
        (orientation === "vertical" &&
          col === shipCol &&
          row >= shipRow &&
          row < shipRow + ship.length)
      ) {
        ship.hit();
        this.board[row][col] = "hit";
        return true;
      }
    }

    this.missedAttacks.push({ row, col });
    this.board[row][col] = "miss";
    return false;
  }

  allShipsSunk() {
    return this.ships.every((shipInfo) => shipInfo.ship.isSunk());
  }
}

export { Gameboard };
