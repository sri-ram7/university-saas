jest.mock("../../models/Result", () => ({
  create: jest.fn(),
}));

jest.mock("../../models/Mark", () => ({
  find: jest.fn(),
}));

jest.mock("../../middleware/softDelete", () => jest.fn());

const Result = require("../../models/Result");
const Mark = require("../../models/Mark");
const ApiError = require("../../utils/ApiError");
const { generateResult } = require("../../services/resultService");

describe("resultService.generateResult", () => {
  const student = "student-id";
  const semester = "semester-id";

  const mockMarks = (marks) => {
    const lean = jest.fn().mockResolvedValue(marks);
    const populate = jest.fn().mockReturnValue({ lean });
    Mark.find.mockReturnValue({ populate });
    return { populate, lean };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a passing result from marks for the requested semester", async () => {
    const marks = [
      {
        obtainedMarks: 80,
        exam: { name: "Midterm", courseOffering: { semester } },
      },
      {
        obtainedMarks: 60,
        exam: { name: "Final", courseOffering: { semester } },
      },
      { obtainedMarks: 100, exam: null },
    ];
    const expectedResult = { _id: "result-id", status: "PASS" };
    const query = mockMarks(marks);
    Result.create.mockResolvedValue(expectedResult);

    await expect(generateResult({ student, semester })).resolves.toBe(
      expectedResult
    );

    expect(Mark.find).toHaveBeenCalledWith({
      student,
      isDeleted: { $ne: true },
    });
    expect(query.populate).toHaveBeenCalledWith({
      path: "exam",
      populate: {
        path: "courseOffering",
        select: "semester",
      },
    });
    expect(Result.create).toHaveBeenCalledWith({
      student,
      semester,
      sgpa: "7.00",
      cgpa: "7.00",
      totalCredits: 8,
      earnedCredits: 8,
      status: "PASS",
    });
  });

  it("records a failing result with no earned credits when the average is below the pass threshold", async () => {
    mockMarks([
      {
        obtainedMarks: 40,
        exam: { name: "Midterm", courseOffering: { semester } },
      },
      {
        obtainedMarks: 50,
        exam: { name: "Final", courseOffering: { semester } },
      },
    ]);
    Result.create.mockResolvedValue({ status: "FAIL" });

    await generateResult({ student, semester });

    expect(Result.create).toHaveBeenCalledWith({
      student,
      semester,
      sgpa: "4.50",
      cgpa: "4.50",
      totalCredits: 8,
      earnedCredits: 0,
      status: "FAIL",
    });
  });

  it("handles one matching mark and rounds the calculated grade to two decimals", async () => {
    mockMarks([
      {
        obtainedMarks: 59,
        exam: { name: "Exam", courseOffering: { semester } },
      },
    ]);
    Result.create.mockResolvedValue({ status: "PASS" });

    await generateResult({ student, semester });

    expect(Result.create).toHaveBeenCalledWith({
      student,
      semester,
      sgpa: "5.90",
      cgpa: "5.90",
      totalCredits: 4,
      earnedCredits: 4,
      status: "PASS",
    });
  });

  it("throws a not-found ApiError when no marks match the semester", async () => {
    mockMarks([
      {
        obtainedMarks: 90,
        exam: { courseOffering: { semester: "another-semester" } },
      },
      { obtainedMarks: 70, exam: null },
    ]);

    await expect(generateResult({ student, semester })).rejects.toMatchObject({
      statusCode: 404,
      message: "No marks found",
    });
    await expect(
      generateResult({ student, semester })
    ).rejects.toBeInstanceOf(ApiError);
    expect(Result.create).not.toHaveBeenCalled();
  });

  it("propagates persistence errors instead of returning a success-shaped result", async () => {
    mockMarks([
      {
        obtainedMarks: 75,
        exam: { name: "Exam", courseOffering: { semester } },
      },
    ]);
    const databaseError = new Error("result persistence failed");
    Result.create.mockRejectedValue(databaseError);

    await expect(generateResult({ student, semester })).rejects.toBe(
      databaseError
    );
  });
});
