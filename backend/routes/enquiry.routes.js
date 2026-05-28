
const express = require("express");
const router = express.Router();

const {
  listEnquiries,
  createEnquiry,
  getEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  bulkDeleteEnquiries,
  getStats,
} = require("../controllers/enquiry.controller");

const { validate } = require("../middleware/error.middleware");

const {
  createEnquirySchema,
  updateEnquirySchema,
  updateStatusSchema,
  listQuerySchema,
} = require("../validators/enquiry.validator");


router.get("/stats", getStats);


router.get("/", validate(listQuerySchema, "query"), listEnquiries);


router.post("/", validate(createEnquirySchema), createEnquiry);


router.delete("/bulk", bulkDeleteEnquiries);


router.get("/:id", getEnquiry);


router.patch("/:id", validate(updateEnquirySchema), updateEnquiry);


router.patch("/:id/status", validate(updateStatusSchema), updateEnquiryStatus);


router.delete("/:id", deleteEnquiry);

module.exports = router;
