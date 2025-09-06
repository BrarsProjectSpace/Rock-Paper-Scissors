// -----------------------------
// DOM ELEMENTS
// -----------------------------

// Player buttons
const pRock = document.getElementById("p-rock");
const pPaper = document.getElementById("p-paper");
const pScissor = document.getElementById("p-scissor");
const playerButtons = [pRock, pPaper, pScissor];
const playerWinStar = document.getElementById("player-win");

// Computer "buttons" (divs styled as buttons)
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

// Restart btn
const restartbtn = document.getElementById("restart");

// Middle section (for results)
const middle = document.querySelector(".middle");
const middleSection = document.getElementById("middle-section"); // gradient flash container

// sounds
const winSound = new Audio("win.wav");
const loseSound = new Audio("lost.mp3");

winSound.volume = 0.1;
loseSound.volume = 0.1;

// -----------------------------
// GAME STATE
// -----------------------------
let playerScore = 0;
let computerScore = 0;
const maxScore = 5;

// -----------------------------
// UTILITY FUNCTIONS
// -----------------------------

// Pick a random computer choice
function getComputersSelection() {
  const randomIndex = Math.floor(Math.random() * computersButtons.length); // 0–2
  restartbtn.style.transform = "Scale(1)";
  return computersButtons[randomIndex];
}

// Reset button highlights
function resetSelections() {
  [...playerButtons, ...computersButtons].forEach((btn) => {
    btn.style.background = "white";
  });
}

// Show result message in the middle section
function showResult(message) {
  // Clear old result if any
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

// Update score UI
function updateScores() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

// Toggle player buttons
function toggleButtons(state) {
  playerButtons.forEach((btn) => (btn.disabled = !state));
}

// -----------------------------
// CONFETTI HELPERS
// -----------------------------
function fireConfetti() {
  // Big win celebration 🎉
  confetti({
    particleCount: 200,
    spread: 120,
    startVelocity: 45,
    origin: { y: 0.6 },
  });

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 160,
      startVelocity: 50,
      origin: { y: 0.7 },
    });
  }, 400);
}

function tinyConfetti() {
  // Small burst for round win 🎊
  confetti({
    particleCount: 30,
    spread: 40,
    startVelocity: 20,
    origin: { y: 0.9 },
  });
}

function loseEffect() {
  // Screen shake
  middleSection.classList.add("shake");
  setTimeout(() => middleSection.classList.remove("shake"), 300);

  // Red sparks (falling particles)
  confetti({
    particleCount: 25,
    spread: 40,
    startVelocity: 25,
    origin: { y: 0.7 },
    colors: ["#ff0000", "#990000"],
  });
}

// -----------------------------
// CORE GAMEPLAY
// -----------------------------
function playRound(playerChoice) {
  resetSelections();

  // Highlight player choice
  playerChoice.style.backgroundColor = "lightgreen";
  playerChoice.classList.add("bounce");
  setTimeout(() => playerChoice.classList.remove("bounce"), 300);

  // Computer picks random choice
  const computerChoice = getComputersSelection();
  computerChoice.style.backgroundColor = "lightcoral";
  computerChoice.classList.add("bounce");
  setTimeout(() => computerChoice.classList.remove("bounce"), 300);

  // Normalize IDs (after last "-")
  const playerId = playerChoice.id.split("-").pop();
  const computerId = computerChoice.id.split("-").pop();

  // Hide both stars first
  playerWinStar.style.visibility = "hidden";
  computerWinStar.style.visibility = "hidden";

  // Decide winner
  if (playerId === computerId) {
    showResult("It's a Draw!");
    middleSection.classList.add("flash-draw");
    setTimeout(() => middleSection.classList.remove("flash-draw"), 500);
  } else if (
    (playerId === "rock" && computerId === "scissor") ||
    (playerId === "paper" && computerId === "rock") ||
    (playerId === "scissor" && computerId === "paper")
  ) {
    playerScore++;
    playerScoreEl.textContent = playerScore;
    playerScoreEl.classList.add("score-bounce");
    playerWinStar.style.visibility = "visible";
    showResult("You Win!");
    loseSound.pause();
    winSound.currentTime = 0;
    winSound.play();

    // 🎊 Tiny confetti for each round win
    tinyConfetti();

    middleSection.classList.add("flash-win");
    setTimeout(() => {
      middleSection.classList.remove("flash-win");
      playerScoreEl.classList.remove("score-bounce");
    }, 500);
  } else {
    computerScore++;
    computerScoreEl.textContent = computerScore;
    computerScoreEl.classList.add("score-bounce");
    computerWinStar.style.visibility = "visible";
    showResult("Computer Wins!");
    winSound.pause();
    loseSound.currentTime = 0;
    loseSound.play();

    // 🔻 Screen shake + red sparks
    loseEffect();

    middleSection.classList.add("flash-lose");
    setTimeout(() => {
      middleSection.classList.remove("flash-lose");
      computerScoreEl.classList.remove("score-bounce");
    }, 500);
  }

  // Update scores
  updateScores();

  // Check if game ended
  checkGameEnd();

  console.log(`Player: ${playerId}, Computer: ${computerId}`);
}

// -----------------------------
// GAME END CHECK
// -----------------------------
function checkGameEnd() {
  if (playerScore >= maxScore || computerScore >= maxScore) {
    toggleButtons(false);

    restartbtn.classList.add("restart-pulse");
    restartbtn.style.transform = "Scale(1.5)";
    restartbtn.style.width = "40%";

    let message = "";
    if (playerScore >= maxScore) {
      message = "🎉 You Win the Match!";
      middleSection.classList.add("flash-win");

      // 🎉 Big confetti celebration
      fireConfetti();
    } else {
      message = "💻 Computer Wins the Match!";
      middleSection.classList.add("flash-lose");
    }

    const endMsg = document.createElement("div");
    endMsg.classList.add("end-message");
    endMsg.innerHTML = `<h2>${message}</h2>`;
    middle.appendChild(endMsg);
  }
}

// -----------------------------
// START GAME HANDLING
// -----------------------------
startBtn.addEventListener("click", () => {
  start();
});

function start() {
  // Animate shrinking
  startDisc.classList.add("shrink");

  setTimeout(() => {
    startDisc.style.display = "none"; // fully remove start screen
    resetSelections();
    updateScores();
  }, 600);
}

// If player clicks before pressing Start → hide start screen & play immediately
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
// RESTART
// -----------------------------
restartbtn.addEventListener("click", () => {
  restartbtn.classList.remove("restart-pulse");
  playerScore = 0;
  computerScore = 0;
  updateScores();

  start();
  playerWinStar.style.visibility = "hidden";
  computerWinStar.style.visibility = "hidden";

  resetSelections();
  setTimeout(() => {
    showResult("Game Restarted | Make Your Move 🎮");
  }, 600);

  const endMsg = middle.querySelector(".end-message");
  if (endMsg) endMsg.remove();

  middleSection.classList.remove("flash-win", "flash-lose", "flash-draw");

  toggleButtons(true);
});
