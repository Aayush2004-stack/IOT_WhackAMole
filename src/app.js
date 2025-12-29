const express = require("express");
const cors= require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

// routes
const scoreRoutes = require("./routes/scoreRoute");
const gameRoute= require("./routes/gameStatusRoute")

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json()); // to parse json bodies


//test db connection + sync model
(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    require("./model/score");

    await sequelize.sync();
    console.log("db sync");
  } catch (err) {
    console.log(err);
  }
})();

app.use(cors({
  origin:"*"
}))

//routes
app.use("/api/score", scoreRoutes);
app.use("/api/",gameRoute);

require("./config/serial");
console.log("Serial communication started");

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

module.exports = app;
