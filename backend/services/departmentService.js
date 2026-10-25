const Department = require("../models/Department");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createDepartment = async (data) => {
  const exists = await Department.findOne({
    $or: [{ name: data.name }, { code: data.code }],
  });

  if (exists) {
    throw new ApiError(400, "Department already exists");
  }

  return await Department.create(data);
};

exports.getDepartments = async (query = {}) => {
  const features = new APIFeatures(Department.find({ isDeleted: { $ne: true } }), query)
    .search(["name", "code"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getDepartmentById = async (id) => {
  const department = await Department.findOne({ _id: id, isDeleted: { $ne: true } }).lean();

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return department;
};

exports.updateDepartment = async (id, data) => {
  const department = await Department.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return department;
};

exports.deleteDepartment = async (id) => {
  const department = await softDelete(Department, id);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  return department;
};