const Result = require("../models/Result");
const Mark = require("../models/Mark");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/APIFeatures");
const softDelete = require("../middleware/softDelete");

exports.generateResult = async ({ student, semester }) => {
  const marks = await Mark.find({
    student,
    isDeleted: { $ne: true },
  })
    .populate({
      path: "exam",
      populate: {
        path: "courseOffering",
        select: "semester",
      },
    })
    .lean();

  const validMarks = marks.filter(
    (mark) =>
      mark.exam?.courseOffering?.semester?.toString() === semester.toString()
  );

  if (!validMarks.length) {
    throw new ApiError(404, "No marks found");
  }

  let total = 0;

  validMarks.forEach(mark => {
    total += mark.obtainedMarks;
  });

  const percentage = total / validMarks.length;

  const sgpa = (percentage / 10).toFixed(2);

  const result = await Result.create({
    student,
    semester,
    sgpa,
    cgpa: sgpa,
    totalCredits: validMarks.length * 4,
    earnedCredits: sgpa >= 5 ? validMarks.length * 4 : 0,
    status: sgpa >= 5 ? "PASS" : "FAIL",
  });

  return result;
};

exports.getResults = async (query = {}) => {
  const features = new APIFeatures(
    Result.find({ isDeleted: { $ne: true } })
      .populate("student")
      .populate("semester"),
    query
  ).paginateIfRequested();

  return await features.query.lean();
};

exports.deleteResult = async (id) => {
  return await softDelete(Result, id);
};