const mongoose = require("mongoose");


const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  const tryConnect = async (connectUri) => {
    try {
      const conn = await mongoose.connect(connectUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[DB] Connected: ${conn.connection.host}`);
      return true;
    } catch (err) {
      console.warn(`[DB] Connection to ${connectUri} failed:`, err.message);
      return false;
    }
  };

  if (uri) {
    const ok = await tryConnect(uri);
    if (ok) return;
    console.warn("[DB] Primary MongoDB unreachable, attempting in-memory fallback.");
  }


  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    const ok = await tryConnect(uri);
    if (ok) {
      mongoose._inMemoryServer = mongod;
      console.log("[DB] Connected to in-memory MongoDB");
      return;
    }
    console.error("[DB] Failed to connect to in-memory MongoDB");
    process.exit(1);
  } catch (err) {
    console.error("[DB] In-memory MongoDB fallback failed:", err.message || err);
    process.exit(1);
  }
};

module.exports = { connectDB };