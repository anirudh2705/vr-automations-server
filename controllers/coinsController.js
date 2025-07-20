const axios = require("axios");
const Coin = require("../models/coins");

const getCoins = async (req, res) => {
  try {
    const url = "https://api.coingecko.com/api/v3/coins/markets";
    const params = {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 100,
      page: 1,
      price_change_percentage: "24h",
    };
    const { data } = await axios.get(url, { params });

    // Map CoinGecko data to coin model format
    const coins = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      priceUsd: coin.current_price,
      marketCap: coin.market_cap,
      percentChange24h: coin.price_change_percentage_24h,
      lastUpdated: new Date(coin.last_updated),
    }));

    // Upsert current data in Mongo
    for (const coin of coins) {
      await Coin.findOneAndUpdate({ coinId: coin.coinId }, coin, {
        upsert: true,
        new: true,
      });
    }

    res.json(coins);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

module.exports = { getCoins };
