async function fetchGameStatus() {
  try {
    const res = await fetch("http://localhost:3000/api/game");
    const data = await res.json();

    document.getElementById("score").innerText = data.score;
    document.getElementById("lives").innerText = data.lives;
  } catch (err) {
    console.error("Error fetching game status");
  }
}

async function fetchHighScore() {
  try {
    const res = await fetch("http://localhost:3000/api/score/highScore");

    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }

    const data = await res.json();
    const highScore = data.data.score;

    console.log("High score:", highScore);
    document.getElementById("highScore").innerText = highScore;

  } catch (err) {
    console.error("Error fetching high score:", err);
  }
}
fetchHighScore();

// Update live score & life 
setInterval(fetchGameStatus, 500);

