const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");

const overlay = document.getElementById("overlay");
const overlayMsg = document.getElementById("overlayMsg");
const newGameBtn = document.getElementById("newGameBtn");

let board = Array(9).fill(null);
let current = "X";
let running = true;
let scores = { X: 0, O: 0, D: 0 };

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateStatus(msg) {
  statusEl.textContent = msg;
}
function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}
function resetBoard() {
  board.fill(null);
  cells.forEach(c => {
    c.textContent = "";
    c.className = "cell";
    c.disabled = false;
  });
  running = true;
  updateStatus(`Player ${current}'s turn`);
}
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: pattern };
    }
  }
  if (board.every(Boolean)) return { winner: "D" };
  return null;
}
function endGame(result) {
  running = false;
  if (result.winner === "D") {
    scores.D++;
    overlayMsg.textContent = "It's a Draw!";
  } else {
    scores[result.winner]++;
    overlayMsg.textContent = `Player ${result.winner} Wins!`;
    result.combo.forEach(i => {
      cells[i].classList.add("win");
      if (result.winner === "O") cells[i].classList.add("o");
    });
  }
  updateScores();
  overlay.classList.remove("hidden");
}
function handleClick(e) {
  const idx = e.target.dataset.index;
  if (!running || board[idx]) return;
  board[idx] = current;
  e.target.textContent = current;
  e.target.classList.add(current === "X" ? "mark-x" : "mark-o");

  const result = checkWinner();
  if (result) {
    endGame(result);
  } else {
    current = current === "X" ? "O" : "X";
    updateStatus(`Player ${current}'s turn`);
  }
}

cells.forEach(c => c.addEventListener("click", handleClick));
restartBtn.addEventListener("click", () => resetBoard());
resetBtn.addEventListener("click", () => {
  scores = { X: 0, O: 0, D: 0 };
  updateScores();
  resetBoard();
});
newGameBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
  resetBoard();
});

// init
updateScores();
resetBoard();
