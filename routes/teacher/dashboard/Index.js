const express = require("express");
const StudentProfileModel = require("../../../models/Students/StudentProfile.model");
const ClassDetailModel = require("../../../models/Classes/ClassDetail.model");
const InfoModel = require("../../../models/Assignments/Info.model");
const DetailModel = require("../../../models/Subjects/Detail.model");
const cloudinary = require("cloudinary");
const ProfileModel = require("../../../models/Teachers/Profile.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "teacher") {
    const teacher = await ProfileModel.findOne({ email: sess.email });
    // console.log("Teacher: ", teacher);
    res.render("teacher/dashboard/Dashboard", { teacher });
  } else {
    res.redirect("/");
  }
});

router.get("/view/:subject", async (req, res) => {
  const sess = req.session;
  const sub = req.params.subject;
  if (sess.email && sess.password && sess.identifier === "teacher") {
    const assignments = await InfoModel.find({ subject: sub });
    const students = await StudentProfileModel.find({});
    const classes = await ClassDetailModel.find({});
    // console.log("Assignments: ", assignments);
    // console.log("Students: ", students);
    res.render("teacher/assignments/Assignments", {
      assignments,
      students,
      classes,
    });
  } else {
    res.redirect("/");
  }
});

router.get("/assignment/view/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "teacher") {
    const assignment = await InfoModel.findById(id);
    const classes = await ClassDetailModel.find({});
    res.render("teacher/assignments/View", { assignment, classes, msg: "" });
  } else {
    res.redirect("/");
  }
});

router.post("/assignment/update/:id", async (req, res) => {
  const sess = req.session;
  const score = req.body.score;
  const grade = req.body.grade;
  const comment = req.body.comment;
  const id = req.params.id;

  if (sess.email && sess.password && sess.identifier === "teacher") {
    try {
      await InfoModel.findByIdAndUpdate(id, {
        score: score,
        grade: grade,
        comment: comment,
      });

      res.redirect(`/portal/teacher/dashboard/assignment/view/${id}`);
    } catch (error) {
      console.error("Assignment updating error:", error);
      const assignment = await InfoModel.findById(id);
      const classes = await ClassDetailModel.find({});
      res.render("teacher/assignments/View", {
        assignment,
        classes,
        msg: "An Error Occuured",
      });
    }
  } else {
    res.redirect("/");
  }
});

router.get("/assignment/delete/:id", async (req, res) => {
  const sess = req.session;
  const assignmentId = req.params.id;

  if (sess.email && sess.password && sess.identifier === "teacher") {
    try {
      const assignment = await InfoModel.findById(assignmentId);

      // Delete file from Cloudinary if it exists
      if (assignment.filePublicId) {
        try {
          await cloudinary.uploader.destroy(assignment.filePublicId);
        } catch (deleteError) {
          console.error("Cloudinary delete error:", deleteError);
        }
      }

      // Delete assignment from database
      await InfoModel.findByIdAndDelete(assignmentId);

      res.redirect("/portal/teacher/dashboard");
    } catch (error) {
      console.error("Assignment deletion error:", error);
      res.redirect("/portal/teacher/dashboard");
    }
  } else {
    res.redirect("/");
  }
});

module.exports = router;
