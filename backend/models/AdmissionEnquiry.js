
const mongoose = require("mongoose");


const STATUS = Object.freeze({
  PENDING: "Pending",
  CONTACTED: "Contacted",
  ADMITTED: "Admitted",
  REJECTED: "Rejected",
});


const DEPARTMENTS = Object.freeze([
  "Computer Science",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Medicine",
  "Law",
  "Arts & Humanities",
  "Natural Sciences",
  "Architecture",
]);

const admissionEnquirySchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
   
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
  
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[+\d][\d\s\-().]{6,19}$/, "Invalid phone number format"],
    },
   
    course: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
 
    department: {
      type: String,
      required: true,
      enum: {
        values: DEPARTMENTS,
        message: "'{VALUE}' is not a valid department",
      },
    },

    status: {
      type: String,
      enum: {
        values: Object.values(STATUS),
        message: "'{VALUE}' is not a valid status",
      },
      default: STATUS.PENDING,
    },
  
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


admissionEnquirySchema.index({ name: "text", email: "text", course: "text" });
admissionEnquirySchema.index({ status: 1, department: 1 });
admissionEnquirySchema.index({ createdAt: -1 });


admissionEnquirySchema.statics.buildFilter = function ({ search, status, department } = {}) {
  const filter = {};
  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ name: re }, { email: re }, { course: re }];
  }
  if (status) filter.status = status;
  if (department) filter.department = department;
  return filter;
};

const AdmissionEnquiry = mongoose.model("AdmissionEnquiry", admissionEnquirySchema);

module.exports = { AdmissionEnquiry, STATUS, DEPARTMENTS };
