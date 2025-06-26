const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subjectDetail = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubjectDetail", subjectDetail);
