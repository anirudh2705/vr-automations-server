const express = require("express");
const router = express.Router();
const Coin = require("../models/coins");
const {
  singleCoinHistory,
  currentCoinHistory,
} = require("../controllers/historyController");

// POST /api/history - store snapshot of current prices from Coin collection
router.post("/", currentCoinHistory);

// GET /api/history/:coinId - get history for a coin
router.get("/:coinId", singleCoinHistory);

module.exports = router;
