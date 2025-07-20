const mongoose = require("mongoose");

const CoinSchema = new mongoose.Schema({
  coinId: { type: String, unique: true, required: true },
  name: String,
  symbol: String,
  priceUsd: Number,
  marketCap: Number,
  percentChange24h: Number,
  lastUpdated: Date,
});

module.exports = mongoose.model("Coin", CoinSchema);
