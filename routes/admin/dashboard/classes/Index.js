const express = require("express");
const ClassDetailModel = require("../../../../models/Classes/ClassDetail.model");
const DetailModel = require("../../../../models/Subjects/Detail.model");
const ProfileModel = require("../../../../models/Teachers/Profile.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const classes = await ClassDetailModel.find({}).sort({ createdAt: -1 });
    console.log(classes);
    res.render("admin/dashboard/classes/View", { classes });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/add", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const subjects = await DetailModel.find({}).sort({ createdAt: -1 });
    const teachers = await ProfileModel.find({}).sort({ createdAt: -1 });
    res.render("admin/dashboard/classes/Add", { msg: "", subjects, teachers });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.post("/add", async (req, res) => {
  const sess = req.session;
  const name = req.body.name;
  const Subjects = req.body.subjects;
  const teacher = req.body.classTeacher;
  console.log(name, Subjects, teacher);
  if (sess.email && sess.password && sess.identifier === "admin") {
    const subjects = await DetailModel.find({}).sort({ createdAt: -1 });
    const teachers = await ProfileModel.find({}).sort({ createdAt: -1 });
    if (name == null) {
      res.render("admin/dashboard/subjects/Add", {
        msg: "Title cannot be empty",
        subjects,
        teachers,
      });
    } else if (Subjects.length <= 0) {
      res.render("admin/dashboard/subjects/Add", {
        msg: "Subjects cannot be empty",
        subjects,
        teachers,
      });
    } else {
      await ClassDetailModel.create({
        name: name,
        subjects: Subjects,
        classTeacher: teacher,
      });
      res.redirect("/portal/admin/dashboard/classes");
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/view/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const classs = await ClassDetailModel.findById(id);
    console.log(classs);
    res.render("admin/dashboard/classes/ViewSingle", { classs });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/edit/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier) {
    const classs = await ClassDetailModel.findById(id);
    const subjects = await DetailModel.find({}).sort({ createdAt: -1 });
    const teachers = await ProfileModel.find({}).sort({ createdAt: -1 });
    res.render("admin/dashboard/classes/Edit", {
      classs,
      msg: "",
      subjects,
      teachers,
    });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.post("/edit/:id", async (req, res) => {
  const sess = req.session;
  const name = req.body.name;
  const Subjects = req.body.subjects;
  const classTeacher = req.body.classTeacher;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const classs = await ClassDetailModel.findById(id);
    const subjects = await DetailModel.find({}).sort({ createdAt: -1 });
    const teachers = await ProfileModel.find({}).sort({ createdAt: -1 });
    if (name == null) {
      res.render("admin/dashboard/classes/Edit", {
        msg: "Title cannot be empty",
        classs,
        subjects,
        teachers,
      });
    } else if (Subjects.length <= 0) {
      res.render("admin/dashboard/classes/Edit", {
        msg: "Subjects cannot be empty",
        classs,
        subjects,
        teachers,
      });
    } else {
      await ClassDetailModel.findByIdAndUpdate(id, {
        name: name,
        subjects: Subjects,
        classTeacher: classTeacher,
      });
      res.redirect(`/portal/admin/dashboard/classes/view/${id}`);
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/delete/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier) {
    await ClassDetailModel.findByIdAndDelete(id);
    res.redirect(`/portal/admin/dashboard/classes`);
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
