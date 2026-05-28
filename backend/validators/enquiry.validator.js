

const Joi = require("joi");
const { DEPARTMENTS } = require("../models/AdmissionEnquiry");

const STATUS_VALUES = ["Pending", "Contacted", "Admitted", "Rejected"];


const fields = {
  name: Joi.string().min(2).max(100).trim().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Applicant name is required",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).trim().lowercase().messages({
    "string.email": "Please provide a valid email address (e.g. john@example.com)",
    "any.required": "Email address is required",
    "string.empty": "Email cannot be empty",
  }),
  phone: Joi.string()
    .pattern(/^[+\d][\d\s\-().]{6,19}$/)
    .messages({
      "string.pattern.base":
        "Phone must be a valid number (7–20 digits, optional +, spaces, dashes allowed)",
      "any.required": "Phone number is required",
      "string.empty": "Phone cannot be empty",
    }),
  course: Joi.string().max(150).trim().messages({
    "string.max": "Course name cannot exceed 150 characters",
    "any.required": "Course name is required",
    "string.empty": "Course cannot be empty",
  }),
  department: Joi.string()
    .valid(...DEPARTMENTS)
    .messages({
      "any.only": `Department must be one of: ${DEPARTMENTS.join(", ")}`,
      "any.required": "Department is required",
    }),
  status: Joi.string()
    .valid(...STATUS_VALUES)
    .messages({
      "any.only": `Status must be one of: ${STATUS_VALUES.join(", ")}`,
    }),
  notes: Joi.string().max(1000).allow("").trim().messages({
    "string.max": "Notes cannot exceed 1000 characters",
  }),
};


const createEnquirySchema = Joi.object({
  name: fields.name.required(),
  email: fields.email.required(),
  phone: fields.phone.required(),
  course: fields.course.required(),
  department: fields.department.required(),
  status: fields.status.default("Pending"),
  notes: fields.notes.default(""),
});


const updateEnquirySchema = Joi.object({
  name: fields.name,
  email: fields.email,
  phone: fields.phone,
  course: fields.course,
  department: fields.department,
  status: fields.status,
  notes: fields.notes,
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const updateStatusSchema = Joi.object({
  status: fields.status.required(),
});


const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow("").default(""),
  status: Joi.string().valid(...STATUS_VALUES, "").default(""),
  department: Joi.string().valid(...DEPARTMENTS, "").default(""),
  sortBy: Joi.string()
    .valid("name", "email", "course", "department", "status", "createdAt")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

module.exports = {
  createEnquirySchema,
  updateEnquirySchema,
  updateStatusSchema,
  listQuerySchema,
};
