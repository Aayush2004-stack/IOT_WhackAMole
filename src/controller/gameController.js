// gameController.js
const { getScore, getLives, getLastUpdate } = require("../config/serial");

function getLiveGameData(req,res) {
    // If Arduino hasn't sent data for 3 seconds, show waiting message
    if (Date.now() - getLastUpdate() > 3000) {
        return res.json({ status: "Waiting for Arduino..." });
    }

    console.log(getLives());

    return res.json({
        score: getScore(),
        lives: getLives(),
        
    });
}

module.exports = {
    getLiveGameData,
};