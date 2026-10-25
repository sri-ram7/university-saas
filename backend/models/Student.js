const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        advisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
        },

        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Program",
            required: true,
        },

        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: true,
        },

        universityId: {
            type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("Student", studentSchema);