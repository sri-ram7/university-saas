const Faculty = require("../models/Faculty");
const Department = require("../models/Department");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createFaculty = async (data) => {
  const exists = await Faculty.findOne({ email: data.email });

  if (exists) {
    throw new ApiError(400, "Faculty already exists");
  }

  const department = await Department.findById(data.department);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return await Faculty.create(data);
};

exports.getFaculties = async (query = {}) => {
  const features = new APIFeatures(
    Faculty.find({ isDeleted: { $ne: true } }).populate("department"),
    query
  )
    .search(["name", "email", "designation"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getFacultyById = async (id) => {
  const faculty = await Faculty.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("department")
    .lean();

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  return faculty;
};

exports.updateFaculty = async (id, data) => {
  const faculty = await Faculty.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("department");

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  return faculty;
};
    
exports.deleteFaculty = async (id) => {
  const faculty = await softDelete(Faculty, id);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  return faculty;
};