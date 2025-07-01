const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assignmentInfo = new Schema(
  {
    student: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    file: {
      type: String,
    },
    filePublicId: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      default: 0,
    },
    score: {
      type: Number,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentInfo", assignmentInfo);
