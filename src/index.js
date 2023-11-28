import { Player } from "./player.js";
import { Computer } from "./player.js";
import { Ship } from "./ship.js";

const gameboardsContainer = document.getElementsByClassName("gameboard");
const playergameboardContainer = gameboardsContainer[0];
const computergameboardContainer = gameboardsContainer[1];
const header = document.getElementById("header");
const messageInfo = document.getElementsByClassName("information-message")[0];

const startButton = document.getElementById("start-button");
startButton.style.display = "none";

let restartButton = document.createElement("button");
restartButton.id = "restart-button";
restartButton.innerHTML = "Restart Game";
restartButton.style.display = "none";
header.appendChild(restartButton);

restartButton.addEventListener("click", () => {
  restartGame();
});

const yourTurnText = document.getElementById("your-turn");
yourTurnText.style.display = "none";
const enemyTurnText = document.getElementById("enemy-turn");
enemyTurnText.style.display = "none";

const selectableShips = document.getElementsByClassName("player-ship-info");
let selectedShip;
let selectedShipInfo;

let shipsDirection = "horizontal";
const directionText = document.getElementById("orientation");

let player = new Player();
let computer = new Computer();

computer.createShips();

let gameStarted = false;

updateBoards(player.gameboard, computer.gameboard);

startButton.addEventListener("click", () => {
  if (allShipsPlaced()) startGame();
});

if (!gameStarted) {
  Array.from(selectableShips).forEach((ship, i) => {
    ship.addEventListener("click", () => {
      if (ship.className !== "player-ship-info placed") {
        Array.from(selectableShips).forEach((ship) => {
          if (ship.className !== "player-ship-info placed")
            ship.className = "player-ship-info";
        });

        ship.className = "player-ship-info selected";
        selectedShip = new Ship(
          selectableShips[i].lastElementChild.childElementCount
        );
        selectedShipInfo = ship;
      }
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "f" || event.key === "F") {
    if (shipsDirection === "horizontal") {
      shipsDirection = "vertical";
      directionText.textContent = "Orientation (F): Vertical";
      return;
    }

    if (shipsDirection === "vertical") {
      shipsDirection = "horizontal";
      directionText.textContent = "Orientation (F): Horizontal";
      return;
    }
  }
});

function updateBoards(player_gameboard, computer_gameboard) {
  if (allShipsPlaced() && !gameStarted) {
    startButton.style.display = "block";
  }
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

      if (!gameStarted) {
        gridSquare.addEventListener("click", () => {
          if (player.gameboard.placeShip(selectedShip, i, j, shipsDirection)) {
            selectedShipInfo.className = "player-ship-info placed";
            selectedShip = null;
          }
          updateBoards(player.gameboard, computer.gameboard);
        });
      }

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
        squareIdentity.className = "square-identity water";
      }

      gridSquare.appendChild(squareIdentity);
      if (gameStarted && player.isTurn) {
        gridSquare.addEventListener("click", () => {
          player.makeMove(computer.gameboard, i, j);
          updateBoards(player.gameboard, computer.gameboard);
          computer.isTurn = true;
          player.isTurn = false;
        });
      }

      gridRow.appendChild(gridSquare);
    }

    computergameboardContainer.appendChild(gridRow);
  }
}

function allShipsPlaced() {
  let player_ships = document.getElementById("player-ships").children;
  let allShipsPlaced = true;

  for (let i = 1; i < player_ships.length; i++) {
    if (player_ships[i].className != "player-ship-info placed") {
      allShipsPlaced = false;
      break;
    }
  }

  return allShipsPlaced;
}

function startGame() {
  gameStarted = true;
  startButton.style.display = "none";
  while (messageInfo.childElementCount > 0) {
    messageInfo.removeChild(messageInfo.lastElementChild);
  }
  let midgameInfo = document.createElement("p");
  midgameInfo.innerHTML =
    "The game has begun! Click on the computer's gameboard (right) to make your move.<br><br>After making your move the computer will make one in return, the first one to destroy the other's ships wins!";
  messageInfo.appendChild(midgameInfo);

  updateBoards(player.gameboard, computer.gameboard);

  function gameLoop() {
    if (computer.isTurn) {
      yourTurnText.style.display = "none";
      enemyTurnText.style.display = "block";
      computer.makeMove(player.gameboard);
      player.isTurn = true;
      updateBoards(player.gameboard, computer.gameboard);
    } else if (player.isTurn) {
      enemyTurnText.style.display = "none";
      yourTurnText.style.display = "block";
    }

    if (!gameOver()) {
      setTimeout(gameLoop, 1000);
    }
  }

  gameLoop();
}

function gameOver() {
  if (player.gameboard.allShipsSunk()) {
    console.log("the computer wins!");
    gameStarted = false;

    yourTurnText.style.display = "none";
    enemyTurnText.style.display = "none";
    restartButton.style.display = "block";
    while (messageInfo.childElementCount > 0) {
      messageInfo.removeChild(messageInfo.lastElementChild);
    }
    let aftergameInfo = document.createElement("p");
    aftergameInfo.innerHTML =
      'The computer wins!<br><br>Click "Restart Game" to play again!';
    messageInfo.appendChild(aftergameInfo);
    return true;
  } else if (computer.gameboard.allShipsSunk()) {
    console.log("the player wins!");
    gameStarted = false;

    yourTurnText.style.display = "none";
    enemyTurnText.style.display = "none";
    restartButton.style.display = "block";
    while (messageInfo.childElementCount > 0) {
      messageInfo.removeChild(messageInfo.lastElementChild);
    }
    let aftergameInfo = document.createElement("p");
    aftergameInfo.innerHTML =
      'You win!<br><br>Click "Restart Game" to play again!';
    messageInfo.appendChild(aftergameInfo);
    return true;
  }
  return false;
}

function restartGame() {
  player = new Player();
  computer = new Computer();
  computer.createShips();
  updateBoards(player.gameboard, computer.gameboard);
  gameStarted = false;
  startButton.style.display = "block";
  restartButton.style.display = "none";
  while (messageInfo.childElementCount > 0) {
    messageInfo.removeChild(messageInfo.lastElementChild);
  }
  let pregameInfo = document.createElement("p");
  pregameInfo.innerHTML =
    'Place your ships by selecting them on the left and then clicking on your board. The orientation can be changed by clicking f<br><br>After placing your ships press "Start Game"';
  messageInfo.appendChild(pregameInfo);

  Array.from(selectableShips).forEach((ship, i) => {
    ship.className = "player-ship-info";
  });
}
