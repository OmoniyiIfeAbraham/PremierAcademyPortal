const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentProfile = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfile);
