const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherProfile = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    classes: {
      type: [String],
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["HOD", "Teacher"],
      default: "Teacher",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherProfile", teacherProfile);
