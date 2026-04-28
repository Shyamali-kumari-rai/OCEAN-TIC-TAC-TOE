let scoreX = 0;
let scoreO = 0;

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;
let mode = "friend"; // default mode

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Set Mode
function setMode(selectedMode) {
  mode = selectedMode;
  restartGame();
  statusText.textContent = mode === "ai"
    ? "🤖 AI Mode Activated!"
    : "👫 Friend Mode Activated!";
}

//  Cell Click
cells.forEach(cell => {
  cell.addEventListener("click", cellClicked);
});

function cellClicked() {
  const index = this.getAttribute("data-index");

  if (board[index] !== "" || !running) return;

  makeMove(index, currentPlayer);

  if (checkWinner()) return;

  switchPlayer();

  //  AI Move
  if (mode === "ai" && currentPlayer === "O" && running) {
    setTimeout(aiMove, 500);
  }
}

// Make Move
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player === "X" ? "🐠" : "🐡";

  const clickSound = document.getElementById("clickSound");
  clickSound.currentTime = 0;
  clickSound.play();
}

//  Switch Player
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer === "X" ? "🐠" : "🐡"}'s Turn`;
}

//  Check Winner
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {

      //  Update score
      if (board[a] === "X") {
        scoreX++;
        document.getElementById("scoreX").textContent = scoreX;
      } else {
        scoreO++;
        document.getElementById("scoreO").textContent = scoreO;
      }

      statusText.textContent = `🎉 Player ${board[a] === "X" ? "🐠" : "🐡"} Wins!`;
      document.getElementById("winSound").play();

      running = false;
      return true;
    }
  }

  //  Draw
  if (!board.includes("")) {
    statusText.textContent = "😮 It's a Draw!";
    document.getElementById("drawsound").play(); // optional sound
    running = false;
    return true;
  }

  return false;
}

//  AI LOGIC (Simple)
function aiMove() {
  // 1 Try to WIN
  let move = findBestMove("O");
  if (move !== -1) {
    makeMove(move, "O");
    if (checkWinner()) return;
    switchPlayer();
    return;
  }

  // 2Try to BLOCK player
  move = findBestMove("X");
  if (move !== -1) {
    makeMove(move, "O");
    if (checkWinner()) return;
    switchPlayer();
    return;
  }

  // 3️Otherwise random
  let emptyCells = board
    .map((val, index) => val === "" ? index : null)
    .filter(val => val !== null);

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  makeMove(randomIndex, "O");

  if (checkWinner()) return;

  switchPlayer();
}
function findBestMove(player) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    let values = [board[a], board[b], board[c]];

    // Check if 2 same + 1 empty
    if (values.filter(v => v === player).length === 2 &&
        values.includes("")) {

      if (board[a] === "") return a;
      if (board[b] === "") return b;
      if (board[c] === "") return c;
    }
  }
  return -1;
}
// Restart Game
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  running = true;

  cells.forEach(cell => cell.textContent = "");

  statusText.textContent = `Player 🐠's Turn`;
}