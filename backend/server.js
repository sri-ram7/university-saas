

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { connectDB } = require("./config/db");
const enquiryRoutes = require("./routes/enquiry.routes");
const { globalErrorHandler, notFoundHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(helmet());
const isProduction = process.env.NODE_ENV === "production";
app.use(
  cors({
    origin: isProduction ? (process.env.CLIENT_ORIGIN || "http://localhost:3000") : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}


app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/enquiries", enquiryRoutes);


app.use(notFoundHandler);
app.use(globalErrorHandler);

const start = async () => {
  await connectDB();

  const tryListen = (port) => {
    const server = app.listen(port, () => {
      console.log(`[Server] Running on http://localhost:${port} [${process.env.NODE_ENV || "development"}]`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`[Server] Port ${port} in use, trying ${port + 1}...`);
        tryListen(port + 1);
      } else {
        console.error("[Server] Failed to start:", err);
        process.exit(1);
      }
    });
  };

  tryListen(Number(PORT));
};

start();

module.exports = app; 