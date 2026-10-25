const express = require("express");
const router = express.Router();

const {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
} = require("../controllers/batchController");

const {
  createBatchValidator,
} = require("../validators/batchValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createBatchValidator,
  validate,
  createBatch
);

router.get(
  "/",
  authMiddleware,
  getBatches
);

router.get(
  "/:id",
  authMiddleware,
  getBatchById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateBatch
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteBatch
);

module.exports = router;