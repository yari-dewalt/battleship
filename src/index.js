import { Player } from "./player.js";
import { Computer } from "./player.js";

const gameboardsContainer = document.getElementsByClassName("gameboard");
const playergameboardContainer = gameboardsContainer[0];
const computergameboardContainer = gameboardsContainer[1];

const player = new Player();
const computer = new Computer();

let firstShip = player.createShip(2);
let secondShip = player.createShip(4);

player.gameboard.placeShip(firstShip, 2, 2, "horizontal");
computer.gameboard.placeShip(secondShip, 1, 2, "vertical");

updateBoards(player.gameboard, computer.gameboard);

computer.makeMove(player.gameboard);

updateBoards(player.gameboard, computer.gameboard);

player.makeMove(computer.gameboard, 1, 2);

updateBoards(player.gameboard, computer.gameboard);

function updateBoards(player_gameboard, computer_gameboard) {
  while (playergameboardContainer.lastChild) {
    playergameboardContainer.removeChild(playergameboardContainer.lastChild);
  }

  while (computergameboardContainer.lastChild) {
    computergameboardContainer.removeChild(
      computergameboardContainer.lastChild
    );
  }

  for (let i = 0; i < player_gameboard.board.length; i++) {
    let gridRow = document.createElement("div");
    gridRow.className = "grid-row";
    for (let j = 0; j < player_gameboard.board[i].length; j++) {
      let gridSquare = document.createElement("div");
      gridSquare.className = "grid-square";

      let squareIdentity = document.createElement("div");
      if (player_gameboard.board[i][j] == "")
        squareIdentity.className = "square-identity water";
      else if (player_gameboard.board[i][j] === "miss")
        squareIdentity.className = "square-identity miss";
      else if (player_gameboard.board[i][j] === "hit")
        squareIdentity.className = "square-identity hit";
      else {
        squareIdentity.className = "square-identity ship";
      }

      gridSquare.appendChild(squareIdentity);

      gridRow.appendChild(gridSquare);
    }

    playergameboardContainer.appendChild(gridRow);
  }

  for (let i = 0; i < computer_gameboard.board.length; i++) {
    let gridRow = document.createElement("div");
    gridRow.className = "grid-row";
    for (let j = 0; j < computer_gameboard.board[i].length; j++) {
      let gridSquare = document.createElement("div");
      gridSquare.className = "grid-square";

      let squareIdentity = document.createElement("div");
      if (computer_gameboard.board[i][j] == "")
        squareIdentity.className = "square-identity water";
      else if (computer_gameboard.board[i][j] === "miss")
        squareIdentity.className = "square-identity miss";
      else if (computer_gameboard.board[i][j] === "hit")
        squareIdentity.className = "square-identity hit";
      else {
        squareIdentity.className = "square-identity ship";
      }

      gridSquare.appendChild(squareIdentity);
      gridSquare.addEventListener("click", () => {
        player.makeMove(computer.gameboard, i, j);
        updateBoards(player.gameboard, computer.gameboard);
      });

      gridRow.appendChild(gridSquare);
    }

    computergameboardContainer.appendChild(gridRow);
  }
}
