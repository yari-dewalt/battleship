import { Player } from "./player.js";
import { Computer } from "./player.js";

const gameboardContainer = document.getElementsByClassName("gameboard")[0];

const player = new Player();
const computer = new Computer();

let firstShip = player.createShip(2);
player.gameboard.placeShip(firstShip, 2, 2, "horizontal");

updateBoard(player.gameboard);

computer.makeMove(player.gameboard);

updateBoard(player.gameboard);

function updateBoard(gameboard) {
  while (gameboardContainer.lastChild) {
    gameboardContainer.removeChild(gameboardContainer.lastChild);
  }

  for (let i = 0; i < gameboard.board.length; i++) {
    let gridRow = document.createElement("div");
    gridRow.className = "grid-row";
    for (let j = 0; j < gameboard.board[i].length; j++) {
      let gridSquare = document.createElement("div");
      gridSquare.className = "grid-square";

      let squareIdentity = document.createElement("div");
      if (gameboard.board[i][j] == "")
        squareIdentity.className = "square-identity water";
      else if (gameboard.board[i][j] === "miss")
        squareIdentity.className = "square-identity miss";
      else if (gameboard.board[i][j] === "hit")
        squareIdentity.className = "square-identity hit";
      else {
        squareIdentity.className = "square-identity ship";
      }

      gridSquare.appendChild(squareIdentity);

      gridRow.appendChild(gridSquare);
    }

    gameboardContainer.appendChild(gridRow);
  }
}
