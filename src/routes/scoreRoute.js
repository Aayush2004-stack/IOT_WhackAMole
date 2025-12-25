const express = require("express");

const ctrl= require("../controller/scoreController");

const router = express.Router();

router.post("/",ctrl.addScore)

module.exports= router;