const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const studentService = require("../services/studentService");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Create Student
// @route   POST /api/students
const createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Student created successfully", student));
});

// @desc    Get All Students
// @route   GET /api/students
const getStudents = asyncHandler(async (req, res) => {
  const students = await studentService.getStudents(req.query);
  //const students = await studentService.getStudents();

  res.status(200).json(new ApiResponse(200, "Students retrieved successfully", students));
});

// @desc    Get Student By ID
// @route   GET /api/students/:id
const getStudentById = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id, req.user);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json(new ApiResponse(200, "Student retrieved successfully", student));
});

// @desc    Update Student
// @route   PUT /api/students/:id
const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(
    req.params.id,
    req.body
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json(new ApiResponse(200, "Student updated successfully", student));
});

// @desc    Delete Student
// @route   DELETE /api/students/:id
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await studentService.deleteStudent(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json(new ApiResponse(200, "Student deleted successfully", student));
});

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
// const getStudents = async (req, res) => {
//     try {
//         const students = await Student.find();
//         res.status(200).json({
//             success: true,
//             data: students,
//             count: students.length,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// const getStudentById = async (req, res) => {
//     try {
//         const student = await Student.findById(req.params.id);
//         if (!student) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Student not found',
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: student,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// const updateStudent = async (req, res) => {
//   try {
//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const deleteStudent = async (req, res) => {
//   try {
//     const student = await Student.findByIdAndDelete(req.params.id);

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Student deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const createStudent = (req, res) => {
//     console.log(req.body);
//     res.json({ message: 'Student data received successfully', data: req.body });
// };

// const createStudent = async (req, res) => {
//   try {
//     const student = await Student.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


