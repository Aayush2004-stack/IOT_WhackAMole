// serialConfig.js
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
require("dotenv").config();

// Serial state
let currentScore = 0;
let currentLives = 3;
let lastUpdate = Date.now();
let gameOverFlag = false;

// Setup Serial Port
const port = new SerialPort({
    path: process.env.SERIAL_PORT, // e.g., /dev/tty.usbmodem14101 or COM3
    baudRate: 9600,
});

// Use ReadlineParser for line-by-line data
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Handle incoming serial data
parser.on("data", (data) => {
    data = data.trim();
    data = data.replace(/[^ -~]+/g, ""); // remove non-printable chars

    console.log("From Arduino:", data);

    if (data.startsWith("SCORE:")) {
        currentScore = parseInt(data.split(":")[1]);
        lastUpdate = Date.now();
    }

    if (data.startsWith("LIFE:")) {
        currentLives = parseInt(data.split(":")[1]);
        lastUpdate = Date.now();
    }

    if (data === "GAME_OVER" && !gameOverFlag) {
        console.log("GAME_OVER received. Final Score:", currentScore);
        gameOverFlag = true;

        // Reset after short delay
        setTimeout(() => {
            currentScore = 0;
            currentLives = 3;
            gameOverFlag = false;
        }, 2000);
    }
});

port.on("open", () => console.log("Serial connection opened"));
port.on("error", (err) => console.error("Serial port error:", err.message));

// Export functions to get current score/lives
module.exports = {
    getScore: () => currentScore,
    getLives: () => currentLives,
    getLastUpdate: () => lastUpdate,
};