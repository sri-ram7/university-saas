const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        courseOffering: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseOffering",
            required: true,
        },

    semester: {
            type: Number,
            required: true,
        },

        academicYear: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED", "DROPPED"],
            default: "ACTIVE",
        },

        grade: {
            type: String,
            default: null,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

enrollmentSchema.index(
    { student: 1, courseOffering: 1 },
    { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);