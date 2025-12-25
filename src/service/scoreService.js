const Score = require("../model/score");

class ScoreService {
  async saveFinalScore(score) {
    try {
      if (!score) {
        const err = new err("Score is required");
        err.status = 400;
        throw err;
      }
      return await Score.create({
        score,
      });
    } catch (err) {
      throw err;
    }
  }

    async getHighScore(){
      try{

          const data = await Score.findOne({
              order:[["score","DESC"]]
          })
          return data;
      }
      catch(err){
          throw err;
      }
    }
}

module.exports = new ScoreService();
