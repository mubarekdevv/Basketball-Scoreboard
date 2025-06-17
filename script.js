// Game State
const gameState = {
  homeTeam: {
    name: "HOME",
    score: 0,
    fouls: 0,
    timeouts: 7,
  },
  guestTeam: {
    name: "GUEST",
    score: 0,
    fouls: 0,
    timeouts: 7,
  },
  gameTime: 720, // 12 minutes in seconds
  isGameActive: false,
  quarter: 1,
  lastScorer: null,
  gameTimer: null,
};

// DOM Elements
const elements = {
  homeScore: document.getElementById("homeScore"),
  guestScore: document.getElementById("guestScore"),
  homeScoreGlow: document.getElementById("homeScoreGlow"),
  guestScoreGlow: document.getElementById("guestScoreGlow"),
  homeScorePing: document.getElementById("homeScorePing"),
  guestScorePing: document.getElementById("guestScorePing"),
  homeFoulsValue: document.getElementById("homeFoulsValue"),
  guestFoulsValue: document.getElementById("guestFoulsValue"),
  homeTimeoutsValue: document.getElementById("homeTimeoutsValue"),
  guestTimeoutsValue: document.getElementById("guestTimeoutsValue"),
  timerDisplay: document.getElementById("timerDisplay"),
  timerBtn: document.getElementById("timerBtn"),
  quarterDisplay: document.getElementById("quarterDisplay"),
  gameStatus: document.getElementById("gameStatus"),
  scoreDifference: document.getElementById("scoreDifference"),
  winnerDisplay: document.getElementById("winnerDisplay"),
  winnerText: document.getElementById("winnerText"),
  homeTeamCard: document.getElementById("homeTeamCard"),
  guestTeamCard: document.getElementById("guestTeamCard"),
  homeCrown: document.getElementById("homeCrown"),
  guestCrown: document.getElementById("guestCrown"),
  homeTrophy: document.getElementById("homeTrophy"),
  guestTrophy: document.getElementById("guestTrophy"),
  homeFoulWarning: document.getElementById("homeFoulWarning"),
  guestFoulWarning: document.getElementById("guestFoulWarning"),
  homeLastScorer: document.getElementById("homeLastScorer"),
  guestLastScorer: document.getElementById("guestLastScorer"),
  homeFoulTrouble: document.getElementById("homeFoulTrouble"),
  guestFoulTrouble: document.getElementById("guestFoulTrouble"),
  homeLowTimeouts: document.getElementById("homeLowTimeouts"),
  guestLowTimeouts: document.getElementById("guestLowTimeouts"),
  homeFoulsStat: document.getElementById("homeFoulsStat"),
  guestFoulsStat: document.getElementById("guestFoulsStat"),
  homeTimeoutsStat: document.getElementById("homeTimeoutsStat"),
  guestTimeoutsStat: document.getElementById("guestTimeoutsStat"),
  homeFoulsSummary: document.getElementById("homeFoulsSummary"),
  guestFoulsSummary: document.getElementById("guestFoulsSummary"),
};

// Utility Functions
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function formatScore(score) {
  return score.toString().padStart(3, "0");
}

function getWinningTeam() {
  if (gameState.homeTeam.score > gameState.guestTeam.score) return "home";
  if (gameState.guestTeam.score > gameState.homeTeam.score) return "guest";
  return null;
}

// Score Functions
function addPoints(team, points) {
  gameState[team + "Team"].score += points;
  gameState.lastScorer = team;

  // Update display
  updateScoreDisplay();

  // Animate score
  animateScore(team);

  // Update game status
  updateGameStatus();

  // Show last scorer indicator
  showLastScorer(team);
}

function animateScore(team) {
  const scoreElement = elements[team + "Score"];
  const pingElement = elements[team + "ScorePing"];

  // Scale animation for main score
  scoreElement.classList.add("animate");
  setTimeout(() => {
    scoreElement.classList.remove("animate");
  }, 500);

  // Ping animation
  pingElement.classList.add("animate");
  setTimeout(() => {
    pingElement.classList.remove("animate");
  }, 1000);
}

function showLastScorer(team) {
  // Hide all last scorer indicators
  elements.homeLastScorer.classList.remove("show");
  elements.guestLastScorer.classList.remove("show");

  // Show for the scoring team
  elements[team + "LastScorer"].classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    elements[team + "LastScorer"].classList.remove("show");
  }, 3000);
}

// Fouls Functions
function updateFouls(team, change) {
  const currentFouls = gameState[team + "Team"].fouls;
  const newFouls = Math.max(0, Math.min(20, currentFouls + change));

  gameState[team + "Team"].fouls = newFouls;

  // Update display
  updateFoulsDisplay();
  updateGameStatus();
}

// Timeouts Functions
function updateTimeouts(team, change) {
  const currentTimeouts = gameState[team + "Team"].timeouts;
  const newTimeouts = Math.max(0, Math.min(7, currentTimeouts + change));

  gameState[team + "Team"].timeouts = newTimeouts;

  // Update display
  updateTimeoutsDisplay();
  updateGameStatus();
}

// Timer Functions
function toggleGame() {
  gameState.isGameActive = !gameState.isGameActive;

  if (gameState.isGameActive) {
    startTimer();
  } else {
    stopTimer();
  }

  updateTimerDisplay();
  updateGameStatus();
}

function startTimer() {
  gameState.gameTimer = setInterval(() => {
    if (gameState.gameTime > 0) {
      gameState.gameTime--;
      updateTimerDisplay();
    } else {
      stopTimer();
      gameState.isGameActive = false;
      updateGameStatus();
    }
  }, 1000);
}

function stopTimer() {
  if (gameState.gameTimer) {
    clearInterval(gameState.gameTimer);
    gameState.gameTimer = null;
  }
}

// Reset Function
function resetGame() {
  // Stop timer
  stopTimer();

  // Reset game state
  gameState.homeTeam.score = 0;
  gameState.homeTeam.fouls = 0;
  gameState.homeTeam.timeouts = 7;
  gameState.guestTeam.score = 0;
  gameState.guestTeam.fouls = 0;
  gameState.guestTeam.timeouts = 7;
  gameState.gameTime = 720;
  gameState.isGameActive = false;
  gameState.quarter = 1;
  gameState.lastScorer = null;

  // Update all displays
  updateAllDisplays();
  updateGameStatus();
}

// Display Update Functions
function updateScoreDisplay() {
  const homeScore = formatScore(gameState.homeTeam.score);
  const guestScore = formatScore(gameState.guestTeam.score);

  elements.homeScore.textContent = homeScore;
  elements.guestScore.textContent = guestScore;
  elements.homeScoreGlow.textContent = homeScore;
  elements.guestScoreGlow.textContent = guestScore;
  elements.homeScorePing.textContent = homeScore;
  elements.guestScorePing.textContent = guestScore;
}

function updateFoulsDisplay() {
  elements.homeFoulsValue.textContent = gameState.homeTeam.fouls;
  elements.guestFoulsValue.textContent = gameState.guestTeam.fouls;
  elements.homeFoulsSummary.textContent = gameState.homeTeam.fouls;
  elements.guestFoulsSummary.textContent = gameState.guestTeam.fouls;

  // Update warning states
  updateFoulWarnings();
}

function updateTimeoutsDisplay() {
  elements.homeTimeoutsValue.textContent = gameState.homeTeam.timeouts;
  elements.guestTimeoutsValue.textContent = gameState.guestTeam.timeouts;

  // Update warning states
  updateTimeoutWarnings();
}

function updateTimerDisplay() {
  elements.timerDisplay.textContent = formatTime(gameState.gameTime);

  // Update timer styling
  if (gameState.gameTime <= 60) {
    elements.timerDisplay.className = "timer-display warning";
  } else {
    elements.timerDisplay.className = "timer-display normal";
  }

  // Update timer button
  if (gameState.isGameActive) {
    elements.timerBtn.textContent = "PAUSE";
    elements.timerBtn.className = "timer-btn pause";
  } else {
    elements.timerBtn.textContent = "START";
    elements.timerBtn.className = "timer-btn start";
  }
}

function updateFoulWarnings() {
  // Home team foul warnings
  if (gameState.homeTeam.fouls >= 7) {
    elements.homeFoulWarning.classList.add("show");
    elements.homeFoulTrouble.classList.add("show");
    elements.homeFoulsStat.classList.add("warning");
    elements.homeFoulsValue.classList.add("warning");
    elements.homeFoulsSummary.classList.add("warning");
  } else {
    elements.homeFoulWarning.classList.remove("show");
    elements.homeFoulTrouble.classList.remove("show");
    elements.homeFoulsStat.classList.remove("warning");
    elements.homeFoulsValue.classList.remove("warning");
    elements.homeFoulsSummary.classList.remove("warning");
  }

  // Guest team foul warnings
  if (gameState.guestTeam.fouls >= 7) {
    elements.guestFoulWarning.classList.add("show");
    elements.guestFoulTrouble.classList.add("show");
    elements.guestFoulsStat.classList.add("warning");
    elements.guestFoulsValue.classList.add("warning");
    elements.guestFoulsSummary.classList.add("warning");
  } else {
    elements.guestFoulWarning.classList.remove("show");
    elements.guestFoulTrouble.classList.remove("show");
    elements.guestFoulsStat.classList.remove("warning");
    elements.guestFoulsValue.classList.remove("warning");
    elements.guestFoulsSummary.classList.remove("warning");
  }
}

function updateTimeoutWarnings() {
  // Home team timeout warnings
  if (gameState.homeTeam.timeouts <= 2) {
    elements.homeLowTimeouts.classList.add("show");
  } else {
    elements.homeLowTimeouts.classList.remove("show");
  }

  // Guest team timeout warnings
  if (gameState.guestTeam.timeouts <= 2) {
    elements.guestLowTimeouts.classList.add("show");
  } else {
    elements.guestLowTimeouts.classList.remove("show");
  }
}

function updateGameStatus() {
  const winningTeam = getWinningTeam();
  const scoreDiff = Math.abs(
    gameState.homeTeam.score - gameState.guestTeam.score
  );

  // Update score difference
  elements.scoreDifference.textContent = scoreDiff;

  // Update winning team display
  if (winningTeam && scoreDiff > 0) {
    elements.winnerDisplay.classList.add("show");
    elements.winnerText.textContent = `${winningTeam.toUpperCase()} LEADING`;
  } else {
    elements.winnerDisplay.classList.remove("show");
  }

  // Update team card winning states
  if (winningTeam === "home") {
    elements.homeTeamCard.classList.add("winning");
    elements.guestTeamCard.classList.remove("winning");
    elements.homeCrown.classList.add("show");
    elements.guestCrown.classList.remove("show");
    elements.homeTrophy.classList.add("winning");
    elements.guestTrophy.classList.remove("winning");
  } else if (winningTeam === "guest") {
    elements.guestTeamCard.classList.add("winning");
    elements.homeTeamCard.classList.remove("winning");
    elements.guestCrown.classList.add("show");
    elements.homeCrown.classList.remove("show");
    elements.guestTrophy.classList.add("winning");
    elements.homeTrophy.classList.remove("winning");
  } else {
    elements.homeTeamCard.classList.remove("winning");
    elements.guestTeamCard.classList.remove("winning");
    elements.homeCrown.classList.remove("show");
    elements.guestCrown.classList.remove("show");
    elements.homeTrophy.classList.remove("winning");
    elements.guestTrophy.classList.remove("winning");
  }

  // Update game status indicator
  if (gameState.isGameActive) {
    elements.gameStatus.className = "status-indicator active";
    elements.gameStatus.querySelector(".status-text").textContent =
      "GAME ACTIVE";
  } else {
    elements.gameStatus.className = "status-indicator paused";
    elements.gameStatus.querySelector(".status-text").textContent =
      "GAME PAUSED";
  }

  // Update warnings
  updateFoulWarnings();
  updateTimeoutWarnings();
}

function updateAllDisplays() {
  updateScoreDisplay();
  updateFoulsDisplay();
  updateTimeoutsDisplay();
  updateTimerDisplay();
  elements.quarterDisplay.textContent = gameState.quarter;

  // Clear all status indicators
  elements.homeLastScorer.classList.remove("show");
  elements.guestLastScorer.classList.remove("show");
}

// Button State Management
function updateButtonStates() {
  // Update foul buttons
  const homeFoulButtons = elements.homeFoulsStat.querySelectorAll(".stat-btn");
  const guestFoulButtons =
    elements.guestFoulsStat.querySelectorAll(".stat-btn");

  // Home fouls
  homeFoulButtons[0].disabled = gameState.homeTeam.fouls <= 0; // Decrease button
  homeFoulButtons[1].disabled = gameState.homeTeam.fouls >= 20; // Increase button

  // Guest fouls
  guestFoulButtons[0].disabled = gameState.guestTeam.fouls <= 0; // Decrease button
  guestFoulButtons[1].disabled = gameState.guestTeam.fouls >= 20; // Increase button

  // Update timeout buttons
  const homeTimeoutButtons =
    elements.homeTimeoutsStat.querySelectorAll(".stat-btn");
  const guestTimeoutButtons =
    elements.guestTimeoutsStat.querySelectorAll(".stat-btn");

  // Home timeouts
  homeTimeoutButtons[0].disabled = gameState.homeTeam.timeouts <= 0; // Decrease button
  homeTimeoutButtons[1].disabled = gameState.homeTeam.timeouts >= 7; // Increase button

  // Guest timeouts
  guestTimeoutButtons[0].disabled = gameState.guestTeam.timeouts <= 0; // Decrease button
  guestTimeoutButtons[1].disabled = gameState.guestTeam.timeouts >= 7; // Increase button
}

// Initialize the game
function initializeGame() {
  updateAllDisplays();
  updateGameStatus();
  updateButtonStates();

  // Set up periodic button state updates
  setInterval(updateButtonStates, 100);
}

// Start the game when page loads
document.addEventListener("DOMContentLoaded", initializeGame);
