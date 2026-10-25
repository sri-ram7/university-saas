const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const departmentService = require("../services/departmentService");

exports.createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, department, "Department created successfully"));
});

exports.getDepartments = asyncHandler(async (req, res) => {
  const departments = await departmentService.getDepartments(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, departments, "Departments fetched successfully"));
});

exports.getDepartmentById = asyncHandler(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, department, "Department fetched successfully"));
});

exports.updateDepartment = asyncHandler(async (req, res) => {
  const department = await departmentService.updateDepartment(
    req.params.id,
    req.body
  );

  res
    .status(200)
    .json(new ApiResponse(200, department, "Department updated successfully"));
});

exports.deleteDepartment = asyncHandler(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Department deleted successfully"));
});