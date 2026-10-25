// studentRoutes
const express = require('express');
const studentValidationRules = require("../validators/studentValidator");
const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

// router.post('/', (req, res) => {
//     console.log(req.body);
//     res.json({ message: 'Student data received successfully', data: req.body });
// });

// studentRoutes


router.post(
  "/",
  authMiddleware, 
  studentValidationRules,
  roleMiddleware("admin", "faculty", "student"),
  validate,
  createStudent
);
router.get("/", authMiddleware,roleMiddleware("admin", "faculty") , getStudents);
router.get("/:id", authMiddleware, roleMiddleware("admin", "faculty"), getStudentById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateStudent);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteStudent);

module.exports = router;