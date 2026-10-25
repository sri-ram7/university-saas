const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Department = require("../models/Department");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.getDashboard = async () => {
  const [
    students,
    faculties,
    departments,
    courses,
    enrollments,
  ] = await Promise.all([
    Student.countDocuments({ isDeleted: { $ne: true } }),
    Faculty.countDocuments({ isDeleted: { $ne: true } }),
    Department.countDocuments({ isDeleted: { $ne: true } }),
    Course.countDocuments({ isDeleted: { $ne: true } }),
    Enrollment.countDocuments({ isDeleted: { $ne: true } }),
  ]);

  return {
    students,
    faculties,
    departments,
    courses,
    enrollments,
  };
};