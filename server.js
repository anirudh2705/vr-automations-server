require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const coinsRoutes = require("./routes/coinRoute");
const historyRoutes = require("./routes/historyRoute");
const scheduleFetch = require("./utils/fetchHistory");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limiter);

// Routes
app.use("/api/coins", coinsRoutes);
app.use("/api/history", historyRoutes);

// Start cron job
scheduleFetch();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const start = async function (uri) {
  try {
    await connectDB(uri);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start(MONGO_URI);
