const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const sectionService = require("../services/sectionService");

exports.createSection = asyncHandler(async (req, res) => {
  const section = await sectionService.createSection(req.body);

  res.status(201).json(
    new ApiResponse(201, section, "Section created successfully")
  );
});

exports.getSections = asyncHandler(async (req, res) => {
  const sections = await sectionService.getSections(req.query);

  res.status(200).json(
    new ApiResponse(200, sections, "Sections fetched successfully")
  );
});

exports.getSectionById = asyncHandler(async (req, res) => {
  const section = await sectionService.getSectionById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, section, "Section fetched successfully")
  );
});

exports.updateSection = asyncHandler(async (req, res) => {
  const section = await sectionService.updateSection(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, section, "Section updated successfully")
  );
});

exports.deleteSection = asyncHandler(async (req, res) => {
  await sectionService.deleteSection(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Section deleted successfully")
  );
});