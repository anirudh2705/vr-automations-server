const cron = require("node-cron");
const axios = require("axios");
const Coin = require("../models/coins");

// Runs every hour at minute 0
const scheduleFetch = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Running hourly cron job to fetch coins data...");
      // Fetch coins data from CoinGecko API
      const url = "https://api.coingecko.com/api/v3/coins/markets";
      const params = {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        price_change_percentage: "24h",
      };
      const { data } = await axios.get(url, { params });

      // Upsert coins data in Coin collection
      for (const coin of data) {
        const coinDoc = {
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          priceUsd: coin.current_price,
          marketCap: coin.market_cap,
          percentChange24h: coin.price_change_percentage_24h,
          lastUpdated: new Date(coin.last_updated),
        };
        await Coin.findOneAndUpdate({ coinId: coin.id }, coinDoc, {
          upsert: true,
          new: true,
        });

        // Append to History collection (new record)
        const historyDoc = new History({
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          priceUsd: coin.current_price,
          marketCap: coin.market_cap,
          percentChange24h: coin.price_change_percentage_24h,
          timestamp: new Date(),
        });
        await historyDoc.save();
      }
      console.log("Cron job completed successfully");
    } catch (error) {
      console.error("Cron job error:", error.message);
    }
  });
};

module.exports = scheduleFetch;
