process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "student-api-integration-test-secret";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../../server");
const User = require("../../models/User");
const Student = require("../../models/Student");
const Department = require("../../models/Department");
const Program = require("../../models/Program");
const Batch = require("../../models/Batch");
const useMongoMemoryServer = require("../support/mongo");

describe("Student API", () => {
  let fixtures;
  let adminToken;

  const createToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5m" });

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
    const admin = await User.create({
      name: "Test Admin",
      email: `admin-${Date.now()}@example.test`,
      password: "not-used-by-this-test",
      role: "admin",
      emailVerified: true,
      isVerified: true,
    });

    fixtures = { department, program, batch };
    adminToken = createToken(admin._id.toString());
  });

  const studentPayload = (overrides = {}) => ({
    name: "Alex Student",
    email: `student-${Date.now()}@example.test`,
    department: fixtures.department._id.toString(),
    program: fixtures.program._id.toString(),
    batch: fixtures.batch._id.toString(),
    ...overrides,
  });

  it("creates a student and returns the existing API response shape", async () => {
    const payload = studentPayload();
    const response = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      statusCode: 201,
      message: "Student created successfully",
      data: {
        name: payload.name,
        email: payload.email,
        department: payload.department,
        program: payload.program,
        batch: payload.batch,
      },
    });

    const storedStudent = await Student.findOne({ email: payload.email }).lean();
    expect(storedStudent).not.toBeNull();
  });

  it("lists students for an authenticated administrator", async () => {
    const student = await Student.create(studentPayload());

    const response = await request(app)
      .get("/api/students")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Students retrieved successfully",
    });
    expect(response.body.data.map(({ _id }) => _id)).toContain(
      student._id.toString()
    );
  });

  it("updates a student and persists the changes", async () => {
    const student = await Student.create(studentPayload());
    const update = studentPayload({
      name: "Alex Updated",
      email: "alex.updated@example.test",
    });

    const response = await request(app)
      .put(`/api/students/${student._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(update);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Student updated successfully",
      data: {
        _id: student._id.toString(),
        name: update.name,
        email: update.email,
      },
    });
    await expect(Student.findById(student._id).lean()).resolves.toMatchObject({
      name: update.name,
      email: update.email,
    });
  });

  it("soft-deletes a student and excludes it from reads", async () => {
    const student = await Student.create(studentPayload());

    const response = await request(app)
      .delete(`/api/students/${student._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Student deleted successfully",
    });
    await expect(Student.findById(student._id).lean()).resolves.toMatchObject({
      isDeleted: true,
    });

    const listResponse = await request(app)
      .get("/api/students")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.map(({ _id }) => _id)).not.toContain(
      student._id.toString()
    );
  });

  it("rejects requests without authentication", async () => {
    const response = await request(app).post("/api/students").send(studentPayload());

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: "No token provided",
    });
    expect(await Student.countDocuments()).toBe(0);
  });

  it("rejects an authenticated user whose role is not permitted", async () => {
    const userId = new mongoose.Types.ObjectId();
    await User.collection.insertOne({
      _id: userId,
      name: "Registrar",
      email: "registrar@example.test",
      password: "not-used-by-this-test",
      role: "registrar",
      emailVerified: true,
      isVerified: true,
    });

    const response = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${createToken(userId.toString())}`)
      .send(studentPayload());

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      success: false,
      message: "Forbidden",
    });
    expect(await Student.countDocuments()).toBe(0);
  });

  it("rejects invalid input before persisting a student", async () => {
    const response = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(studentPayload({ email: "invalid-email" }));

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "email",
          msg: "Valid email is required",
        }),
      ])
    );
    expect(await Student.countDocuments()).toBe(0);
  });

});
