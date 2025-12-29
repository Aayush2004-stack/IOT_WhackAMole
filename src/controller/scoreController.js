const scoreService = require("../service/scoreService");

// exports.addScore = async (req, res) => {
//   try {
//     const { score } = req.body;

//     if (!score) {
//       return res.status(400).json({ message: "No score provided" });
//     }
//     scoreService.saveFinalScore(score);
//     return res.status(200).json({
//       message: "score added successfully",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: err,
//     });
//   }
// };

exports.getHighScore = async (req, res) => {
  const highScore = await scoreService.getHighScore();
  return res.status(200).json({
    data: highScore,
  });
};
