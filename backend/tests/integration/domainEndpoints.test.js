process.env.NODE_ENV = "test";

jest.mock("../../middleware/upload", () => ({
  single: () => (req, res, next) => {
    req.file = {
      path: "https://example.test/test-upload.pdf",
      filename: "test-upload",
    };
    next();
  },
}));

const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../../server");
const useMongoMemoryServer = require("../support/mongo");
const User = require("../../models/User");
const Department = require("../../models/Department");
const Faculty = require("../../models/Faculty");
const Course = require("../../models/Course");
const Student = require("../../models/Student");
const Semester = require("../../models/Semester");
const Program = require("../../models/Program");
const Batch = require("../../models/Batch");
const Section = require("../../models/Section");
const CourseOffering = require("../../models/CourseOffering");
const Enrollment = require("../../models/Enrollment");
const Attendance = require("../../models/Attendance");
const Exam = require("../../models/Exam");
const Mark = require("../../models/Mark");
const Result = require("../../models/Result");
const Notification = require("../../models/Notification");
const AuditLog = require("../../models/AuditLog");

const models = [
  User,
  Department,
  Faculty,
  Course,
  Student,
  Semester,
  Program,
  Batch,
  Section,
  CourseOffering,
  Enrollment,
  Attendance,
  Exam,
  Mark,
  Result,
  Notification,
  AuditLog,
];

describe("authenticated domain API endpoints", () => {
  useMongoMemoryServer();

  let adminToken;
  let fixtures;

  beforeAll(async () => {
    await Promise.all(models.map((model) => model.init()));
  });

  beforeEach(async () => {
    const admin = await User.create({
      name: "Endpoint Test Admin",
      email: "endpoint-admin@example.test",
      password: "not-used-by-this-test",
      role: "admin",
      emailVerified: true,
      isVerified: true,
    });
    adminToken = jwt.sign({ id: admin._id.toString() }, process.env.JWT_SECRET);

    const department = await Department.create({
      name: "Endpoint Engineering",
      code: "EPE",
    });
    const faculty = await Faculty.create({
      name: "Endpoint Faculty",
      email: "endpoint-faculty@example.test",
      phone: "555-0100",
      designation: "Professor",
      department: department._id,
    });
    const program = await Program.create({
      name: "Endpoint Computer Science",
      code: "EPCS",
      duration: 4,
      department: department._id,
    });
    const batch = await Batch.create({
      name: "Endpoint 2026",
      startYear: 2026,
      endYear: 2030,
      program: program._id,
    });
    const semester = await Semester.create({
      name: "Endpoint Fall 2026",
      number: 1,
      academicYear: "2026-2027",
      startDate: "2026-08-01",
      endDate: "2026-12-20",
    });
    const section = await Section.create({
      name: "Endpoint A",
      department: department._id,
      semester: semester._id,
      faculty: faculty._id,
    });
    const student = await Student.create({
      name: "Endpoint Student",
      email: "endpoint-student@example.test",
      department: department._id,
      program: program._id,
      batch: batch._id,
    });
    const course = await Course.create({
      name: "Endpoint Algorithms",
      code: "EPA101",
      credits: 4,
      semester: 1,
      department: department._id,
      faculty: faculty._id,
    });
    const courseOffering = await CourseOffering.create({
      course: course._id,
      faculty: faculty._id,
      semester: semester._id,
      section: section._id,
      batch: batch._id,
    });
    const exam = await Exam.create({
      name: "Endpoint Midterm",
      type: "MID",
      courseOffering: courseOffering._id,
      examDate: "2026-10-15",
      totalMarks: 100,
      passingMarks: 40,
    });

    fixtures = {
      userId: admin._id,
      department,
      faculty,
      program,
      batch,
      semester,
      section,
      student,
      course,
      courseOffering,
      exam,
    };
  });

  const api = () => ({
    get: (path) =>
      request(app).get(path).set("Authorization", `Bearer ${adminToken}`),
    post: (path) =>
      request(app).post(path).set("Authorization", `Bearer ${adminToken}`),
    put: (path) =>
      request(app).put(path).set("Authorization", `Bearer ${adminToken}`),
    delete: (path) =>
      request(app).delete(path).set("Authorization", `Bearer ${adminToken}`),
  });

  it("creates, reads, updates, and soft-deletes departments", async () => {
    const created = await api().post("/api/departments").send({
      name: "New Endpoint Department",
      code: "NED",
    });
    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({
      name: "New Endpoint Department",
      code: "NED",
    });

    const id = created.body.data._id;
    expect((await api().get("/api/departments")).body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: id })])
    );
    expect((await api().get(`/api/departments/${id}`)).body.data.name).toBe(
      "New Endpoint Department"
    );

    const updated = await api().put(`/api/departments/${id}`).send({
      name: "Updated Endpoint Department",
    });
    expect(updated.status).toBe(200);
    expect(updated.body.data.name).toBe("Updated Endpoint Department");

    expect((await api().delete(`/api/departments/${id}`)).status).toBe(200);
    expect(await Department.findById(id).lean()).toMatchObject({
      isDeleted: true,
    });
  });

  it("creates, reads, updates, and soft-deletes faculty", async () => {
    const created = await api().post("/api/faculties").send({
      name: "New Endpoint Faculty",
      email: "new-endpoint-faculty@example.test",
      phone: "555-0101",
      designation: "Lecturer",
      department: fixtures.department._id.toString(),
    });
    expect(created.status).toBe(201);
    const id = created.body.data._id;

    expect((await api().get("/api/faculties")).body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: id })])
    );
    expect((await api().get(`/api/faculties/${id}`)).body.data.email).toBe(
      "new-endpoint-faculty@example.test"
    );

    const updated = await api().put(`/api/faculties/${id}`).send({
      designation: "Senior Lecturer",
    });
    expect(updated.status).toBe(200);
    expect(updated.body.data.designation).toBe("Senior Lecturer");

    expect((await api().delete(`/api/faculties/${id}`)).status).toBe(200);
    expect(await Faculty.findById(id).lean()).toMatchObject({
      isDeleted: true,
    });
  });

  it("creates, reads, updates, and soft-deletes courses", async () => {
    const created = await api().post("/api/courses").send({
      name: "New Endpoint Course",
      code: "NEC101",
      credits: 3,
      semester: 2,
      department: fixtures.department._id.toString(),
      faculty: fixtures.faculty._id.toString(),
    });
    expect(created.status).toBe(201);
    const id = created.body.data._id;

    expect((await api().get("/api/courses")).body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: id })])
    );
    expect((await api().get(`/api/courses/${id}`)).body.data.code).toBe(
      "NEC101"
    );

    const updated = await api().put(`/api/courses/${id}`).send({
      name: "Updated Endpoint Course",
    });
    expect(updated.status).toBe(200);
    expect(updated.body.data.name).toBe("Updated Endpoint Course");

    expect((await api().delete(`/api/courses/${id}`)).status).toBe(200);
    expect(await Course.findById(id).lean()).toMatchObject({
      isDeleted: true,
    });
  });

  it.each([
    [
      "semesters",
      "/api/semesters",
      {
        name: "Endpoint Spring 2027",
        number: 2,
        academicYear: "2026-2027",
        startDate: "2027-01-10",
        endDate: "2027-05-20",
      },
      { name: "Updated Spring 2027" },
      Semester,
    ],
    [
      "programs",
      "/api/programs",
      {
        name: "Endpoint Data Science",
        code: "EPDS",
        duration: 4,
        department: () => fixtures.department._id.toString(),
      },
      { name: "Updated Data Science" },
      Program,
    ],
    [
      "batches",
      "/api/batches",
      {
        name: "Endpoint 2027",
        startYear: 2027,
        endYear: 2031,
        program: () => fixtures.program._id.toString(),
      },
      { name: "Updated Batch 2027" },
      Batch,
    ],
    [
      "sections",
      "/api/sections",
      {
        name: "Endpoint B",
        department: () => fixtures.department._id.toString(),
        semester: () => fixtures.semester._id.toString(),
        faculty: () => fixtures.faculty._id.toString(),
      },
      { name: "Updated Section B" },
      Section,
    ],
    [
      "course offerings",
      "/api/course-offerings",
      {
        course: () => fixtures.course._id.toString(),
        faculty: () => fixtures.faculty._id.toString(),
        semester: () => fixtures.semester._id.toString(),
        section: () => fixtures.section._id.toString(),
        batch: () => fixtures.batch._id.toString(),
      },
      { section: () => fixtures.section._id.toString() },
      CourseOffering,
    ],
    [
      "exams",
      "/api/exams",
      {
        name: "Endpoint Final",
        type: "EXTERNAL",
        courseOffering: () => fixtures.courseOffering._id.toString(),
        examDate: "2026-12-10",
        totalMarks: 100,
        passingMarks: 40,
      },
      { name: "Updated Final Exam" },
      Exam,
    ],
    [
      "marks",
      "/api/marks",
      {
        student: () => fixtures.student._id.toString(),
        exam: () => fixtures.exam._id.toString(),
        obtainedMarks: 87,
      },
      { obtainedMarks: 95 },
      Mark,
    ],
    [
      "attendance",
      "/api/attendance",
      {
        student: () => fixtures.student._id.toString(),
        course: () => fixtures.course._id.toString(),
        faculty: () => fixtures.faculty._id.toString(),
        semester: () => fixtures.semester._id.toString(),
        date: "2026-10-20",
        status: "PRESENT",
      },
      { status: "ABSENT" },
      Attendance,
    ],
    [
      "enrollments",
      "/api/enrollments",
      {
        student: () => fixtures.student._id.toString(),
        courseOffering: () => fixtures.courseOffering._id.toString(),
        semester: 1,
        academicYear: "2026-2027",
      },
      { academicYear: "2027-2028" },
      Enrollment,
    ],
  ])("creates, reads by id, updates, and soft-deletes %s", async (_name, endpoint, payload, updatePayload, Model) => {
    const body = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        typeof value === "function" ? value() : value,
      ])
    );
    const created = await api().post(endpoint).send(body);

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      success: true,
      data: expect.objectContaining({ _id: expect.any(String) }),
    });
    const createdId = created.body.data._id;
    await expect(Model.exists({ _id: createdId })).resolves.toBeTruthy();

    const listed = await api().get(endpoint);
    expect(listed.status).toBe(200);
    expect(listed.body.success).toBe(true);
    expect(listed.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: createdId }),
      ])
    );

    const byId = await api().get(`${endpoint}/${createdId}`);
    expect(byId.status).toBe(200);
    expect(byId.body.data).toMatchObject({ _id: createdId });

    const updateBody = Object.fromEntries(
      Object.entries(updatePayload).map(([key, value]) => [
        key,
        typeof value === "function" ? value() : value,
      ])
    );
    const updated = await api().put(`${endpoint}/${createdId}`).send(updateBody);
    expect(updated.status).toBe(200);

    const deleted = await api().delete(`${endpoint}/${createdId}`);
    expect(deleted.status).toBe(200);
    expect(await Model.findById(createdId).lean()).toMatchObject({
      isDeleted: true,
    });
  });

  it("generates results from matching exam marks and lists them", async () => {
    await Mark.create({
      student: fixtures.student._id,
      exam: fixtures.exam._id,
      obtainedMarks: 80,
    });

    const response = await api().post("/api/results/generate").send({
      student: fixtures.student._id.toString(),
      semester: fixtures.semester._id.toString(),
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        student: fixtures.student._id.toString(),
        semester: fixtures.semester._id.toString(),
        sgpa: 8,
        status: "PASS",
      },
    });

    const listed = await api().get("/api/results");
    expect(listed.status).toBe(200);
    expect(listed.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: response.body.data._id }),
      ])
    );
  });

  it("returns dashboard totals from persisted domain records", async () => {
    const response = await api().get("/api/dashboard");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        students: 1,
        faculties: 1,
        departments: 1,
        courses: 1,
        enrollments: 0,
      },
    });
  });

  it("serves the root welcome endpoint", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, World!");
  });

  it("uploads a file through the API and returns its storage metadata", async () => {
    const response = await api().post("/api/uploads").attach("file", Buffer.from("test"), {
      filename: "test.pdf",
      contentType: "application/pdf",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        url: "https://example.test/test-upload.pdf",
        publicId: "test-upload",
      },
    });
  });

  it("creates, reads, lists, and soft-deletes notifications for the authenticated administrator", async () => {
    const created = await api().post("/api/notifications").send({
      title: "Endpoint maintenance",
      message: "Scheduled maintenance notice",
      audience: "ALL",
    });

    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({
      title: "Endpoint maintenance",
      message: "Scheduled maintenance notice",
      audience: "ALL",
    });
    expect(created.body.data.createdBy).toBeDefined();
    const id = created.body.data._id;

    const listed = await api().get("/api/notifications");
    expect(listed.status).toBe(200);
    expect(listed.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: id }),
      ])
    );

    const byId = await api().get(`/api/notifications/${id}`);
    expect(byId.status).toBe(200);
    expect(byId.body.data._id).toBe(id);

    const deleted = await api().delete(`/api/notifications/${id}`);
    expect(deleted.status).toBe(200);
    expect(await Notification.findById(id).lean()).toMatchObject({
      isDeleted: true,
    });
  });

  it("lists audit logs for an administrator", async () => {
    const log = await AuditLog.create({
      user: fixtures.userId,
      action: "CREATE",
      module: "endpoint-test",
      method: "POST",
      endpoint: "/api/endpoint-test",
      ipAddress: "127.0.0.1",
    });

    const response = await api().get("/api/audit-logs");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: log._id.toString() }),
      ])
    );
  });
});
