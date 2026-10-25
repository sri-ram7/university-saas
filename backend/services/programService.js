const Program = require("../models/Program");
const Department = require("../models/Department");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createProgram = async (data) => {
  const department = await Department.exists({ _id: data.department });

  if (!department)
    throw new ApiError(404, "Department not found");

  return await Program.create(data);
};

exports.getPrograms = async (query = {}) => {
  const features = new APIFeatures(Program.find({ isDeleted: { $ne: true } }).populate("department"), query)
    .search(["name", "code"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getProgramById = async (id) => {
  const program = await Program.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("department")
    .lean();

  if (!program) {
    throw new ApiError(404, "Program not found");
  }

  return program;
};

exports.updateProgram = async (id, data) => {
  if (data.department) {
    const department = await Department.exists({ _id: data.department });
    if (!department) {
      throw new ApiError(404, "Department not found");
    }
  }

  const program = await Program.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("department");

  if (!program) {
    throw new ApiError(404, "Program not found");
  }

  return program;
};

exports.deleteProgram = async (id) => {
  const program = await softDelete(Program, id);

  if (!program) {
    throw new ApiError(404, "Program not found");
  }

  return program;
};