let scoreX = 0;
let scoreO = 0;

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

// SYMBOLS
const symbols = {
  X: "🐠",
  O: "🐡"
};

// SOUNDS
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// CLICK EVENTS
cells.forEach(cell => cell.addEventListener("click", handleCellClick));

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = symbols[currentPlayer];

  // click sound
  clickSound.currentTime = 0;
  clickSound.play();

  checkResult();
}

function checkResult() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;

    if (board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  // WIN
  if (roundWon) {
    statusDisplay.textContent = `Player ${currentPlayer} Wins! 🎉`;

    // play win sound
    winSound.currentTime = 0;
    winSound.play();

    if (currentPlayer === "X") {
      scoreX++;
      document.getElementById("scoreX").textContent = scoreX;
    } else {
      scoreO++;
      document.getElementById("scoreO").textContent = scoreO;
    }

    gameActive = false;
    return;
  }

  // DRAW
  if (!board.includes("")) {
    statusDisplay.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  // SWITCH PLAYER
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.textContent = `Player ${symbols[currentPlayer]}'s Turn`;
}

// RESTART
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";

  statusDisplay.textContent = `Player ${symbols[currentPlayer]}'s Turn`;

  cells.forEach(cell => {
    cell.textContent = "";
  });
}