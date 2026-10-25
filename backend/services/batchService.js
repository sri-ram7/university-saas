const Batch = require("../models/Batch");
const Program = require("../models/Program");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createBatch = async (data) => {
  const program = await Program.findById(data.program);

  if (!program) {
    throw new ApiError(404, "Program not found");
  }

  return await Batch.create(data);
};

exports.getBatches = async (query = {}) => {
  const features = new APIFeatures(
    Batch.find({ isDeleted: { $ne: true } }).populate({
      path: "program",
      populate: {
        path: "department",
      },
    }),
    query
  )
    .search(["name", "code"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getBatchById = async (id) => {
  const batch = await Batch.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate({
      path: "program",
      populate: {
        path: "department",
      },
    })
    .lean();

  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  return batch;
};

exports.updateBatch = async (id, data) => {
  if (data.program) {
    const program = await Program.findById(data.program);
    if (!program) {
      throw new ApiError(404, "Program not found");
    }
  }

  const batch = await Batch.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("program");

  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  return batch;
};

exports.deleteBatch = async (id) => {
  const batch = await softDelete(Batch, id);

  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  return batch;
};