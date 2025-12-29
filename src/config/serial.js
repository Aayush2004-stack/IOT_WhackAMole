const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const scoreService = require("../service/scoreService");
require("dotenv").config();


// 🔌 Adjust port name
const port = new SerialPort({
    path: process.env.SERIAL_PORT, // macOS example
    baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

let currentScore = 0;
let currentLives = 3;

// 📥 Read data from Arduino
parser.on("data", async (data) => {
    try {
        data = data.trim();
        console.log("From Arduino:", data);

        /**
         * Expected formats from Arduino:
         * SCORE:10
         * LIFE:2
         * GAME_OVER
         */

        if (data.startsWith("SCORE:")) {
            currentScore = parseInt(data.split(":")[1]);
        }

        if (data.startsWith("LIFE:")) {
            currentLives = parseInt(data.split(":")[1]);
        }

        if (data === "GAME_OVER") {
            console.log("Final score:", currentScore);

            // Save score ONLY once at end
            await scoreService.saveFinalScore(currentScore);

            // Reset for next game
            currentScore = 0;
            currentLives = 3;
        }

    } catch (err) {
        console.error("Serial Error:", err.message);
    }
});

// 🔊 Port status
port.on("open", () => {
    console.log("Serial connection opened");
});

port.on("error", (err) => {
    console.error("Serial port error:", err.message);
});

// 📤 Export live data for web API
module.exports = {
    getLiveGameData: () => ({
        score: currentScore,
        lives: currentLives,
    }),
};