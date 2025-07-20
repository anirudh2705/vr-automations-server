const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  name: String,
  symbol: String,
  priceUsd: Number,
  marketCap: Number,
  percentChange24h: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", HistorySchema);
