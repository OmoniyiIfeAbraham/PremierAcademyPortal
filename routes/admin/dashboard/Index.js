const express = require("express");
const ProfileModel = require("../../../models/Teachers/Profile.model");
const DetailModel = require("../../../models/Subjects/Detail.model");
const ClassDetailModel = require("../../../models/Classes/ClassDetail.model");
const StudentProfileModel = require("../../../models/Students/StudentProfile.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const teachers = await ProfileModel.find({});
    const subjects = await DetailModel.find({});
    const classes = await ClassDetailModel.find({});
    const students = await StudentProfileModel.find({});
    res.render("admin/dashboard/index", {
      teachers,
      subjects,
      classes,
      students,
    });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
