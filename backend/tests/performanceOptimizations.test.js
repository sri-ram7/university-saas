process.env.NODE_ENV = "test";

const assert = require("assert");
const APIFeatures = require("../utils/APIFeatures");
const Semester = require("../models/Semester");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const Attendance = require("../models/Attendance");
const attendanceService = require("../services/attendanceService");

const makeQuery = () => {
  const calls = [];
  const query = {
    skip(value) {
      calls.push(["skip", value]);
      return this;
    },
    limit(value) {
      calls.push(["limit", value]);
      return this;
    },
  };

  return { calls, query };
};

async function runTests() {
  const unlimited = makeQuery();
  new APIFeatures(unlimited.query, {}).paginateIfRequested();
  assert.deepStrictEqual(unlimited.calls, [], "No pagination parameters preserve the existing unbounded response");

  const standardPage = makeQuery();
  new APIFeatures(standardPage.query, { page: "2", limit: "25" }).paginateIfRequested();
  assert.deepStrictEqual(
    standardPage.calls,
    [["skip", 25], ["limit", 25]],
    "Requested pagination applies the expected offset and page size"
  );

  const cappedPage = makeQuery();
  new APIFeatures(cappedPage.query, { page: "3", limit: "5000" }).paginateIfRequested();
  assert.deepStrictEqual(
    cappedPage.calls,
    [["skip", 200], ["limit", 100]],
    "Page sizes are capped at 100 records"
  );

  const invalidPage = makeQuery();
  new APIFeatures(invalidPage.query, { page: "-3", limit: "-10" }).paginate();
  assert.deepStrictEqual(
    invalidPage.calls,
    [["skip", 0], ["limit", 1]],
    "Invalid page and non-positive limit values cannot create negative query bounds"
  );

  const indexExists = (model, expectedKeys) =>
    model.schema.indexes().some(([keys]) =>
      Object.keys(expectedKeys).every((key) => keys[key] === expectedKeys[key])
    );

  assert(
    indexExists(Semester, { number: 1, academicYear: 1 }),
    "Semester duplicate-check query has a compound index"
  );
  assert(
    indexExists(Notification, { createdAt: -1 }),
    "Notification createdAt sort has a supporting index"
  );
  assert(
    indexExists(AuditLog, { createdAt: -1 }),
    "Audit log createdAt sort has a supporting index"
  );

  const originalFind = Attendance.find;
  try {
    const calls = [];
    const expectedRows = [{ _id: "attendance-row" }];
    Attendance.find = () => {
      const query = {
        populate() {
          return this;
        },
        skip(value) {
          calls.push(["skip", value]);
          return this;
        },
        limit(value) {
          calls.push(["limit", value]);
          return this;
        },
        lean() {
          calls.push(["lean"]);
          return Promise.resolve(expectedRows);
        },
      };
      return query;
    };

    const unboundedRows = await attendanceService.getAttendance({});
    assert.strictEqual(unboundedRows, expectedRows, "Unpaginated list response remains an array");
    assert.deepStrictEqual(calls, [["lean"]], "Unpaginated legacy calls retain existing record scope and use lean reads");

    calls.length = 0;
    const pageRows = await attendanceService.getAttendance({ page: "2", limit: "5000" });
    assert.strictEqual(pageRows, expectedRows, "Paginated list response remains an array");
    assert.deepStrictEqual(
      calls,
      [["skip", 100], ["limit", 100], ["lean"]],
      "List service applies the maximum page size and returns lean results"
    );
  } finally {
    Attendance.find = originalFind;
  }

  console.log("Performance optimization tests passed.");
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
