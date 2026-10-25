const express = require("express");

const router = express.Router();

const {
  generateResult,
  getResults,
} = require("../controllers/resultController");

const {
  generateResultValidator,
} = require("../validators/resultValidator");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

router.post(
  "/generate",
  auth,
  role("admin"),
  generateResultValidator,
  validate,
  generateResult
);

router.get(
  "/",
  auth,
  getResults
);

module.exports = router;