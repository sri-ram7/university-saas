process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "student-authorization-integration-test-secret";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../../server");
const User = require("../../models/User");
const Student = require("../../models/Student");
const Department = require("../../models/Department");
const Program = require("../../models/Program");
const Batch = require("../../models/Batch");
const { generateAccessToken } = require("../../services/tokenService");
const useMongoMemoryServer = require("../support/mongo");

describe("Student API JWT authentication, RBAC, and tenant isolation", () => {
  let studentId;
  let otherUniversityStudentId;
  let users;

  const createUser = async (role, email) =>
    User.create({
      name: `${role} test user`,
      email,
      password: "not-used-by-this-test",
      role,
      emailVerified: true,
      isVerified: true,
    });

  const bearer = (token) => `Bearer ${token}`;

  useMongoMemoryServer();

  beforeAll(async () => {
    await Promise.all([
      User.init(),
      Student.init(),
      Department.init(),
      Program.init(),
      Batch.init(),
    ]);
  });

  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Department.deleteMany({}),
      Program.deleteMany({}),
      Batch.deleteMany({}),
    ]);

    const department = await Department.create({
      name: "Engineering",
      code: "ENG",
    });
    const program = await Program.create({
      name: "Computer Science",
      code: `CS${Date.now()}`,
      duration: 4,
      department: department._id,
    });
    const batch = await Batch.create({
      name: "2026",
      startYear: 2026,
      endYear: 2030,
      program: program._id,
    });
    const student = await Student.create({
      name: "University A Student",
      email: `student-a-${Date.now()}@example.test`,
      department: department._id,
      program: program._id,
      batch: batch._id,
    });

    studentId = student._id.toString();
    users = {
      admin: await createUser("admin", `admin-${Date.now()}@example.test`),
      faculty: await createUser("faculty", `faculty-${Date.now()}@example.test`),
      student: await createUser("student", `user-student-${Date.now()}@example.test`),
    };

    const otherStudentId = new mongoose.Types.ObjectId();
    await Student.collection.insertOne({
      _id: otherStudentId,
      name: "University B Student",
      email: `student-b-${Date.now()}@example.test`,
      department: department._id,
      program: program._id,
      batch: batch._id,
      universityId: new mongoose.Types.ObjectId(),
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    otherUniversityStudentId = otherStudentId.toString();
  });

  it("rejects a request with no token", async () => {
    const response = await request(app).get(`/api/students/${studentId}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: "No token provided",
    });
  });

  it("rejects an invalid token with HTTP 401", async () => {
    const response = await request(app)
      .get(`/api/students/${studentId}`)
      .set("Authorization", bearer("not-a-valid-jwt"));

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("rejects an expired token with HTTP 401", async () => {
    const expiredToken = jwt.sign(
      { id: users.admin._id.toString(), role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: -1 }
    );
    const response = await request(app)
      .get(`/api/students/${studentId}`)
      .set("Authorization", bearer(expiredToken));

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it.each(["admin", "faculty"])(
    "allows the existing %s role to read a student",
    async (role) => {
      const token = generateAccessToken(users[role]);
      const response = await request(app)
        .get(`/api/students/${studentId}`)
        .set("Authorization", bearer(token));

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        statusCode: 200,
        message: "Student retrieved successfully",
        data: {
          _id: studentId,
          name: "University A Student",
        },
      });
    }
  );

  it("forbids the existing student role from reading student records", async () => {
    const token = generateAccessToken(users.student);
    const response = await request(app)
      .get(`/api/students/${studentId}`)
      .set("Authorization", bearer(token));

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      success: false,
      message: "Forbidden",
    });
  });

  it("denies an administrator from another university access to a student's record", async () => {
    const universityAId = new mongoose.Types.ObjectId();
    const universityBId = new mongoose.Types.ObjectId();
    const adminId = new mongoose.Types.ObjectId();

    await User.collection.insertOne({
      _id: adminId,
      name: "University A Admin",
      email: "cross-university-admin@example.test",
      password: "not-used-by-this-test",
      role: "admin",
      emailVerified: true,
      isVerified: true,
      universityId: universityAId,
    });

    const token = jwt.sign(
      {
        id: adminId.toString(),
        role: "admin",
        universityId: universityAId.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    await Student.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(otherUniversityStudentId) },
      { $set: { universityId: universityBId } }
    );

    const response = await request(app)
      .get(`/api/students/${otherUniversityStudentId}`)
      .set("Authorization", bearer(token));

    expect([403, 404]).toContain(response.status);
    expect(response.body.success).toBe(false);
  });
});
