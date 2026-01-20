let lastScore = 0;
let life = 3;
let gameOverShown = false;
let dbHighScore = 0; // fetched from DB
let currentHighScore = 0; // JS live tracker while playing

const statusEl = document.getElementById("status");
const hudEl = document.getElementById("hud");
const highScoreEl = document.getElementById("highScore");

const missedSound = new Audio("./resources/sounds/missed.mp3");
const gameOverSound = new Audio("./resources/sounds/gameOver.mp3");
const hitSound = new Audio("./resources/sounds/hit-sound.mp3");

missedSound.preload = "auto";
gameOverSound.preload = "auto";
hitSound.preload = "auto";

// ---------------- AUDIO UNLOCK ----------------
document.body.addEventListener("click", function enableAudio() {
  [missedSound, gameOverSound, hitSound].forEach((sound) => {
    sound
      .play()
      .then(() => {
        sound.pause();
        sound.currentTime = 0;
      })
      .catch(() => {});
  });
  document.body.removeEventListener("click", enableAudio);
});

// ---------------- UI FUNCTIONS ----------------
function showIdle() {
  statusEl.innerText = "🎯 HIT THE TARGET TO START THE GAME";
  statusEl.className = "status idle";
  statusEl.style.display = "block";
  hudEl.classList.add("hidden");

  // Match High Score container color
  highScoreEl.parentElement.style.background = statusEl.style.background;
  highScoreEl.parentElement.style.boxShadow = statusEl.style.boxShadow;
  highScoreEl.parentElement.style.color = "#ffffff";

  highScoreEl.innerText = dbHighScore;
}

function showPlaying() {
  statusEl.style.display = "none";
  hudEl.classList.remove("hidden");

  highScoreEl.parentElement.style.background =
    "linear-gradient(135deg, #14532d, #166534)";
  highScoreEl.parentElement.style.boxShadow = "0 0 25px rgba(0,0,0,0.6)";
  highScoreEl.parentElement.style.color = "#ffffff";
}

function showGameOver(score) {
  // Compare with DB high score
  const isNewHigh = score > dbHighScore;

  if (isNewHigh) dbHighScore = score; // update DB tracker
  currentHighScore = dbHighScore; // update live tracker

  statusEl.innerText = isNewHigh
    ? `💀 GAME OVER\n🎉 CONGRATS! NEW HIGH SCORE!\nScore: ${score}`
    : `💀 GAME OVER\nScore: ${score}`;

  statusEl.className = "status gameover";
  statusEl.style.display = "block";
  hudEl.classList.add("hidden");

  // Match High Score container color
  highScoreEl.parentElement.style.background = statusEl.style.background;
  highScoreEl.parentElement.style.boxShadow = statusEl.style.boxShadow;
  highScoreEl.parentElement.style.color = "#ffffff";

  highScoreEl.innerText = currentHighScore;

  setTimeout(showIdle, 5000);
}

// ---------------- FETCH GAME STATUS ----------------
async function fetchGameStatus() {
  try {
    const res = await fetch("http://localhost:3000/api/game");
    const data = await res.json();

    // Game not started
    if (data.lives === 3 && data.score === 0) {
      showIdle();
      life = 3;
      gameOverShown = false;
      currentHighScore = dbHighScore; // reset live tracker
    }

    // Playing
    if (data.lives > 0) {
      showPlaying();
      document.getElementById("score").innerText = data.score;
      document.getElementById("lives").innerText = data.lives;

      // Play hit sound
      if (data.score > lastScore) {
        hitSound.currentTime = 0;
        hitSound.play().catch(() => {});
      }
      lastScore = data.score;

      // Update live high score if beaten
      if (data.score > currentHighScore) {
        currentHighScore = data.score;
        highScoreEl.innerText = currentHighScore;
      }
    }

    // Life lost
    if (data.lives < life && data.lives > 0) {
      missedSound.currentTime = 0;
      missedSound.play().catch(() => {});
    }

    // Game over
    if (data.lives === 0 && !gameOverShown) {
      gameOverSound.currentTime = 0;
      gameOverSound.play().catch(() => {});
      gameOverShown = true;
      showGameOver(data.score);
    }

    life = data.lives;
  } catch (err) {
    console.error("Game status error:", err);
  }
}

// ---------------- FETCH HIGH SCORE FROM DB ----------------
async function fetchHighScore() {
  try {
    const res = await fetch("http://localhost:3000/api/score/highScore");
    const data = await res.json();
    dbHighScore = data.data.score;
    currentHighScore = dbHighScore;
    highScoreEl.innerText = dbHighScore;
  } catch (err) {
    console.error("High score error:", err);
  }
}

fetchHighScore();
setInterval(fetchGameStatus, 400);
