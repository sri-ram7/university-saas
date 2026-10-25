const Student = require("../models/Student");
const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const Course = require("../models/Course");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

const validateRelations = async (studentData) => {
  const { department, advisor, courses } = studentData;

  const [departmentExists, facultyExists, courseCount] = await Promise.all([
    Department.exists({ _id: department }),
    advisor ? Faculty.exists({ _id: advisor }) : Promise.resolve(true),
    courses && courses.length > 0
      ? Course.countDocuments({ _id: { $in: courses } })
      : Promise.resolve(null),
  ]);

  if (!departmentExists) {
    throw new ApiError(404, "Department not found");
  }

  if (!facultyExists) {
    throw new ApiError(404, "Faculty not found");
  }

  if (courseCount !== null && courseCount !== courses.length) {
    throw new ApiError(404, "One or more courses not found");
  }
};

const createStudent = async (studentData) => {
  await validateRelations(studentData);

  return await Student.create(studentData);
};

const getStudents = async (query) => {
  const features = new APIFeatures(
    Student.find({ isDeleted: { $ne: true } })
      .populate("department")
      .populate("program")
      .populate("batch")
      .populate("section"),
    query
  )
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

const getStudentById = async (id, user) => {
  const student = await Student.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("department")
    .populate("advisor")
    .populate("program")
    .populate("batch")
    .populate("section")
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (
    user &&
    user.universityId &&
    student.universityId &&
    user.universityId.toString() !== student.universityId.toString()
  ) {
    throw new ApiError(403, "Access denied to other university records");
  }

  return student;
};

const updateStudent = async (id, studentData) => {
  await validateRelations(studentData);

  const student = await Student.findByIdAndUpdate(id, studentData, {
    new: true,
    runValidators: true,
  })
    .populate("department")
    .populate("advisor")
    .populate("program")
    .populate("batch")
    .populate("section");

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};

const deleteStudent = async (id) => {
  const student = await softDelete(Student, id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};