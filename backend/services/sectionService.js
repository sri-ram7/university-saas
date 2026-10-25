const Section = require("../models/Section");
const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Faculty = require("../models/Faculty");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.createSection = async (data) => {
  const [department, semester, faculty] = await Promise.all([
    Department.exists({ _id: data.department }),
    Semester.exists({ _id: data.semester }),
    Faculty.exists({ _id: data.faculty }),
  ]);
  if (!department)
    throw new ApiError(404, "Department not found");
  if (!semester)
    throw new ApiError(404, "Semester not found");
  if (!faculty)
    throw new ApiError(404, "Faculty not found");

  return await Section.create(data);
};

exports.getSections = async (query = {}) => {
  const features = new APIFeatures(
    Section.find({ isDeleted: { $ne: true } })
      .populate("department")
      .populate("semester")
      .populate("faculty"),
    query
  )
    .search(["name", "code"])
    .filter()
    .sort()
    .paginate();

  return await features.query.lean();
};

exports.getSectionById = async (id) => {
  const section = await Section.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("department")
    .populate("semester")
    .populate("faculty")
    .lean();

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  return section;
};

exports.updateSection = async (id, data) => {
  const section = await Section.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("department")
    .populate("semester")
    .populate("faculty");

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  return section;
};

exports.deleteSection = async (id) => {
  const section = await softDelete(Section, id);

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  return section;
};