const Semester = require("../models/Semester");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createSemester = async (data) => {
  const exists = await Semester.findOne({
    number: data.number,
    academicYear: data.academicYear,
  });

  if (exists) {
    throw new ApiError(400, "Semester already exists");
  }

  return await Semester.create(data);
};

exports.getSemesters = async (query = {}) => {
  const features = new APIFeatures(Semester.find({ isDeleted: { $ne: true } }), query)
    .search(["name", "academicYear"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getSemesterById = async (id) => {
  const semester = await Semester.findOne({ _id: id, isDeleted: { $ne: true } }).lean();

  if (!semester) {
    throw new ApiError(404, "Semester not found");
  }

  return semester;
};

exports.updateSemester = async (id, data) => {
  const semester = await Semester.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!semester) {
    throw new ApiError(404, "Semester not found");
  }

  return semester;
};

exports.deleteSemester = async (id) => {
  const semester = await softDelete(Semester, id);

  if (!semester) {
    throw new ApiError(404, "Semester not found");
  }

  return semester;
};