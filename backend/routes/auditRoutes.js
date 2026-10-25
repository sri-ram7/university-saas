const express = require("express");

const router = express.Router();

const {
  getAuditLogs,
} = require("../controllers/auditController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get(
  "/",
  auth,
  role("admin"),
  getAuditLogs
);

module.exports = router;