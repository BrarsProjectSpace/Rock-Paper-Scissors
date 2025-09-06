// -----------------------------
// DOM ELEMENTS
// -----------------------------

// Player buttons
const pRock = document.getElementById("p-rock");
const pPaper = document.getElementById("p-paper");
const pScissor = document.getElementById("p-scissor");
const playerButtons = [pRock, pPaper, pScissor];
const playerWinStar = document.getElementById("player-win");

// Computer "buttons"
const cRock = document.getElementById("c-rock");
const cPaper = document.getElementById("c-paper");
const cScissor = document.getElementById("c-scissor");
const computersButtons = [cRock, cPaper, cScissor];
const computerWinStar = document.getElementById("computer-win");

// Scores
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");

// Start screen
const startBtn = document.getElementById("start-btn");
const startDisc = document.querySelector(".start-disc");

// Restart button
const restartbtn = document.getElementById("restart");

// Middle section (for results & animations)
const middleSection = document.getElementById("middle-section");
const middle = document.querySelector(".middle");

// -----------------------------
// GAME STATE
// -----------------------------
let playerScore = 0;
let computerScore = 0;

// -----------------------------
// UTILITY FUNCTIONS
// -----------------------------

// Pick a random computer choice
function getComputersSelection() {
  const randomIndex = Math.floor(Math.random() * computersButtons.length);
  return computersButtons[randomIndex];
}

// Reset button highlights
function resetSelections() {
  [...playerButtons, ...computersButtons].forEach((btn) => {
    btn.style.background = "white";
  });
}

// Show result message
function showResult(message) {
  let resultBox = document.getElementById("result-box");
  if (!resultBox) {
    resultBox = document.createElement("h2");
    resultBox.id = "result-box";
    resultBox.style.color = "white";
    resultBox.style.marginTop = "20px";
    resultBox.style.textAlign = "center";
    middle.appendChild(resultBox);
  }
  resultBox.textContent = message;
}

// Update score UI + animate
function updateScores() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;

  // Bounce animation
  playerScoreEl.classList.add("score-bounce");
  computerScoreEl.classList.add("score-bounce");

  setTimeout(() => {
    playerScoreEl.classList.remove("score-bounce");
    computerScoreEl.classList.remove("score-bounce");
  }, 400);
}

// Flash feedback on middle section
function flashFeedback(result) {
  middleSection.classList.remove("flash-win", "flash-lose", "flash-draw");

  if (result === "win") {
    middleSection.classList.add("flash-win");
  } else if (result === "lose") {
    middleSection.classList.add("flash-lose");
  } else {
    middleSection.classList.add("flash-draw");
  }

  setTimeout(() => {
    middleSection.classList.remove("flash-win", "flash-lose", "flash-draw");
  }, 1000);
}

// Bounce animation helper
function bounceElement(el) {
  el.classList.add("bounce");
  setTimeout(() => el.classList.remove("bounce"), 300);
}

// -----------------------------
// CORE GAMEPLAY
// -----------------------------
function playRound(playerChoice) {
  resetSelections();

  // Highlight player choice + bounce
  playerChoice.style.backgroundColor = "lightgreen";
  bounceElement(playerChoice);

  // Computer picks random choice
  const computerChoice = getComputersSelection();
  computerChoice.style.backgroundColor = "lightcoral";
  bounceElement(computerChoice);

  // Normalize IDs
  const playerId = playerChoice.id.split("-").pop();
  const computerId = computerChoice.id.split("-").pop();

  // Hide both stars first
  playerWinStar.style.visibility = "hidden";
  computerWinStar.style.visibility = "hidden";

  // Decide winner
  if (playerId === computerId) {
    showResult("It's a Draw!");
    flashFeedback("draw");
  } else if (
    (playerId === "rock" && computerId === "scissor") ||
    (playerId === "paper" && computerId === "rock") ||
    (playerId === "scissor" && computerId === "paper")
  ) {
    playerScore++;
    playerWinStar.style.visibility = "visible";
    showResult("You Win!");
    flashFeedback("win");
  } else {
    computerScore++;
    computerWinStar.style.visibility = "visible";
    showResult("Computer Wins!");
    flashFeedback("lose");
  }

  updateScores();
}

// -----------------------------
// START GAME HANDLING
// -----------------------------
startBtn.addEventListener("click", () => {
  startDisc.classList.add("shrink");

  setTimeout(() => {
    startDisc.style.display = "none";
    resetSelections();
    updateScores();
  }, 600);
});

// Allow play without pressing start
playerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (startDisc.style.display !== "none") {
      startDisc.style.display = "none";
      resetSelections();
      updateScores();
    }
    playRound(btn);
  });
});

// -----------------------------
// RESTART HANDLING
// -----------------------------
restartbtn.addEventListener("click", () => {
  resetSelections();
  playerScore = 0;
  computerScore = 0;
  updateScores();
  playerWinStar.style.visibility = "hidden";
  computerWinStar.style.visibility = "hidden";
  showResult("Game Restarted! Make your choice.");
});
