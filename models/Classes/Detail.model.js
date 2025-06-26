const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const classDetail = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    classTeacher: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassDetail", classDetail);
