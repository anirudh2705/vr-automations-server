const express = require("express");
const router = express.Router();
const axios = require("axios");
const Coin = require("../models/coins");
const { getCoins } = require("../controllers/coinsController");

router.get("/", getCoins);

module.exports = router;
