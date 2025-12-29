const express = require("express");

const gameCtrl = require("../controller/gameController")

const router = express.Router();

router.get("/game",gameCtrl.getLiveGameData);

module.exports=router;