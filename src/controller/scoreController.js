const scoreService = require("../service/scoreService");

exports.addScore = async (req, res) => {
  const { score } = req.body;

  if (!score) {
    return res.status(400).json({ message: "No score provided" });
  }
  scoreService.saveFinalScore(res,score);
  return res.status(200).json({
    message:"score added successfully"
  })
};
