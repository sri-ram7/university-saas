const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const attendanceService = require("../services/attendanceService");

exports.createAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.createAttendance(req.body);

  res.status(201).json(
    new ApiResponse(201, attendance, "Attendance marked successfully")
  );
});

exports.getAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getAttendance(req.query);

  res.status(200).json(
    new ApiResponse(200, attendance, "Attendance fetched successfully")
  );
});

exports.getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getAttendanceById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, attendance, "Attendance fetched successfully")
  );
});

exports.updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.updateAttendance(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, attendance, "Attendance updated successfully")
  );
});

exports.deleteAttendance = asyncHandler(async (req, res) => {
  await attendanceService.deleteAttendance(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Attendance deleted successfully")
  );
});