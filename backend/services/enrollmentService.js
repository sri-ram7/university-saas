const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const CourseOffering = require("../models/CourseOffering");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createEnrollment = async (data) => {
  const [student, courseOffering] = await Promise.all([
    Student.exists({ _id: data.student }),
    CourseOffering.exists({ _id: data.courseOffering }),
  ]);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found");
  }

  const exists = await Enrollment.findOne({
    student: data.student,
    courseOffering: data.courseOffering,
  });

  if (exists) {
    throw new ApiError(400, "Student already enrolled");
  }

  return await Enrollment.create(data);
};

exports.getEnrollments = async (query = {}) => {
  const features = new APIFeatures(
    Enrollment.find({ isDeleted: { $ne: true } })
      .populate("student")
      .populate({
        path: "courseOffering",
        populate: ["course", "faculty", "semester", "section", "batch"],
      }),
    query
  )
    .search(["student", "course"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getEnrollmentById = async (id) => {
  const enrollment = await Enrollment.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("student")
    .populate({
      path: "courseOffering",
      populate: ["course", "faculty", "semester", "section", "batch"],
    })
    .lean();

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  return enrollment;
};

exports.updateEnrollment = async (id, data) => {
  const enrollment = await Enrollment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("student")
    .populate("courseOffering");

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  return enrollment;
};

exports.deleteEnrollment = async (id) => {
  const enrollment = await softDelete(Enrollment, id);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  return enrollment;
};