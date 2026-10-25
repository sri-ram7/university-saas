const express = require("express");
const mongoose = require("mongoose");
const { redisClient } = require("../config/redis");

const createHealthRouter = ({
  dbConnection = mongoose.connection,
  redis = redisClient,
} = {}) => {
  const router = express.Router();

  router.get("/live", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  router.get("/ready", async (req, res) => {
    let mongoReady = false;
    let redisReady = false;

    if (dbConnection.readyState === 1 && dbConnection.db) {
      try {
        await dbConnection.db.admin().ping();
        mongoReady = true;
      } catch {
        mongoReady = false;
      }
    }

    if (redis.isOpen) {
      try {
        await redis.ping();
        redisReady = true;
      } catch {
        redisReady = false;
      }
    }

    const ready = mongoReady && redisReady;
    res.status(ready ? 200 : 503).json({
      status: ready ? "ok" : "unavailable",
      checks: {
        mongodb: mongoReady ? "ok" : "unavailable",
        redis: redisReady ? "ok" : "unavailable",
      },
    });
  });

  return router;
};

module.exports = createHealthRouter;
