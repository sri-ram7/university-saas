const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const examService = require("../services/examService");

exports.createExam = asyncHandler(async (req, res) => {
  const exam = await examService.createExam(req.body);

  res.status(201).json(
    new ApiResponse(201, exam, "Exam created successfully")
  );
});

exports.getExams = asyncHandler(async (req, res) => {
  const exams = await examService.getExams(req.query);

  res.status(200).json(
    new ApiResponse(200, exams, "Exams fetched successfully")
  );
});

exports.getExamById = asyncHandler(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, exam, "Exam fetched successfully")
  );
});

exports.updateExam = asyncHandler(async (req, res) => {
  const exam = await examService.updateExam(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, exam, "Exam updated successfully")
  );
});

exports.deleteExam = asyncHandler(async (req, res) => {
  await examService.deleteExam(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Exam deleted successfully")
  );
});