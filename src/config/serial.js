// serialConfig.js
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const scoreService = require("../service/scoreService");
require("dotenv").config();

// ------------------------------
// Serial state
// ------------------------------
let currentScore = 0;
let currentLives = 3;
let lastUpdate = Date.now();
let gameState = "IDLE"; // "IDLE" | "PLAYING"

// ------------------------------
// Setup Serial Port
// ------------------------------
const port = new SerialPort({
  path: process.env.SERIAL_PORT, // e.g., /dev/cu.usbmodem14101 or COM3
  baudRate: 9600,
});

// Use ReadlineParser for line-by-line data
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// ------------------------------
// Handle incoming serial data
// ------------------------------
parser.on("data", (data) => {
  data = data.trim();
  data = data.replace(/[^ -~]+/g, ""); // remove non-printable chars

  console.log("From Arduino:", data);

  // ----------------------------
  // Game hit
  // ----------------------------
  if (data.startsWith("HIT! Score:")) {
    currentScore = parseInt(data.split(":")[1]);
    currentLives = currentLives; // no change
    lastUpdate = Date.now();
    gameState = "PLAYING";
  }

  // ----------------------------
  // Miss (life lost)
  // ----------------------------
  if (data.startsWith("MISS! Lives:")) {
    const parts = data.split(":");
    currentLives = parseInt(parts[1]);
    lastUpdate = Date.now();
    gameState = "PLAYING";
  }

  // ----------------------------
  // Game over
  // ----------------------------
  if (data === "GAME OVER") {
    console.log("GAME OVER received. Final Score:", currentScore);
    if (currentScore > 0) {
      scoreService.saveFinalScore(currentScore);
    } else {
      console.log("Score is 0, skipping save.");
    }

    gameState = "IDLE";
    lastUpdate = Date.now();
  }

  // ----------------------------
  // Game restarted
  // ----------------------------
  if (data === "GAME RESTARTED") {
    currentScore = 0;
    currentLives = 3;
    lastUpdate = Date.now();
    gameState = "IDLE";
  }
});

// ------------------------------
// Serial port events
// ------------------------------
port.on("open", () => console.log("Serial connection opened"));
port.on("error", (err) => console.error("Serial port error:", err.message));

// ------------------------------
// Export functions
// ------------------------------
module.exports = {
  getScore: () => currentScore,
  getLives: () => currentLives,
  getLastUpdate: () => lastUpdate,
  getGameState: () => gameState, // IDLE or PLAYING
};
