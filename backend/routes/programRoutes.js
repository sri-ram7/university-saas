const express = require("express");
const router = express.Router();

const {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} = require("../controllers/programController");

const {
  createProgramValidator,
} = require("../validators/programValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createProgramValidator,
  validate,
  createProgram
);

router.get(
  "/",
  authMiddleware,
  getPrograms
);

router.get(
  "/:id",
  authMiddleware,
  getProgramById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateProgram
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProgram
);

module.exports = router;