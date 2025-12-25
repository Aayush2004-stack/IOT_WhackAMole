const Score = require("../model/score");

class ScoreService {
  async saveFinalScore(score) {
    try {
      if (!score) {
        const err = new err("Score is required");
        err.status= 400;
        throw err;
      }
        return await Score.create({
          score,
        });
      
    } catch (err) {
      return err.message;
    }
  }

  
}

module.exports = new ScoreService();
