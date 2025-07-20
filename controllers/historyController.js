const currentCoinHistory = async (req, res) => {
  try {
    const coins = await Coin.find({});
    const historyDocs = coins.map((coin) => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      priceUsd: coin.priceUsd,
      marketCap: coin.marketCap,
      percentChange24h: coin.percentChange24h,
      timestamp: new Date(),
    }));
    await History.insertMany(historyDocs);
    res.json({ message: "History saved" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const singleCoinHistory = async (req, res) => {
  try {
    const coinId = req.params.coinId;
    const historyData = await History.find({ coinId }).sort({ timestamp: 1 });
    res.json(historyData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

module.exports = { currentCoinHistory, singleCoinHistory };
