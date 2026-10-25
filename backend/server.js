require('dotenv').config();
const errorHandler = require("./middleware/errorMiddleware");
const { globalRateLimiter } = require("./middleware/rateLimiter");

const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const programRoutes = require("./routes/programRoutes");
const batchRoutes = require("./routes/batchRoutes");
const courseOfferingRoutes = require("./routes/courseOfferingRoutes");
const examRoutes = require("./routes/examRoutes");
const markRoutes = require("./routes/markRoutes");
const resultRoutes = require("./routes/resultRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const auditRoutes = require("./routes/auditRoutes");
const swaggerRoutes = require("./routes/swaggerRoutes");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require('express');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const requestIdMiddleware = require("./middleware/requestIdMiddleware");
const requestLoggerMiddleware = require("./middleware/requestLoggerMiddleware");
const helmetMiddleware = require("./middleware/helmet");
const requestMetricsMiddleware = require("./middleware/requestMetricsMiddleware");
const healthRoutes = require("./routes/healthRoutes");
const { metricsAuth, metricsHandler } = require("./monitoring/metrics");
const { logger } = require("./utils/logger");

const app = express();

app.use(helmetMiddleware);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse HttpOnly cookies
app.use(requestIdMiddleware); // Attach unique requestId to req & X-Request-ID header
app.use(requestLoggerMiddleware); // Log HTTP requests and slow response warnings
app.use(requestMetricsMiddleware);
app.use("/health", healthRoutes());
app.get("/metrics", metricsAuth, metricsHandler);

app.get('/', (req, res) => {
  res.send('Hello, World!');
}
);

app.use("/api", globalRateLimiter);

app.use("/api/docs", swaggerRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/course-offerings", courseOfferingRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use(errorHandler); // add it after all routes

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;