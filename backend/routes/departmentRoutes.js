const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const {
  createDepartmentValidator,
  updateDepartmentValidator,
} = require("../validators/departmentValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  createDepartmentValidator,
  validate,
  createDepartment
);

router.get(
  "/",
  authMiddleware,
  getDepartments
);

router.get(
  "/:id",
  authMiddleware,
  getDepartmentById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateDepartmentValidator,
  validate,
  updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteDepartment
);

module.exports = router;