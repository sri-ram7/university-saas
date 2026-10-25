const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Faculty = require("../models/Faculty");
const Semester = require("../models/Semester");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createAttendance = async (data) => {
  const [student, course, faculty, semester] = await Promise.all([
    Student.exists({ _id: data.student }),
    Course.exists({ _id: data.course }),
    Faculty.exists({ _id: data.faculty }),
    Semester.exists({ _id: data.semester }),
  ]);
  if (!student) throw new ApiError(404, "Student not found");
  if (!course) throw new ApiError(404, "Course not found");
  if (!faculty) throw new ApiError(404, "Faculty not found");
  if (!semester) throw new ApiError(404, "Semester not found");

  return await Attendance.create(data);
};

exports.getAttendance = async (query = {}) => {
  const features = new APIFeatures(
    Attendance.find({ isDeleted: { $ne: true } })
      .populate("student")
      .populate("course")
      .populate("faculty")
      .populate("semester"),
    query
  ).paginateIfRequested();

  return await features.query.lean();
};

exports.getAttendanceById = async (id) => {
  const attendance = await Attendance.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("student")
    .populate("course")
    .populate("faculty")
    .populate("semester")
    .lean();

  if (!attendance) {
    throw new ApiError(404, "Attendance not found");
  }

  return attendance;
};

exports.updateAttendance = async (id, data) => {
  const attendance = await Attendance.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("student")
    .populate("course")
    .populate("faculty")
    .populate("semester");

  if (!attendance) {
    throw new ApiError(404, "Attendance not found");
  }

  return attendance;
};

exports.deleteAttendance = async (id) => {
  const attendance = await softDelete(Attendance, id);

  if (!attendance) {
    throw new ApiError(404, "Attendance not found");
  }

  return attendance;
};