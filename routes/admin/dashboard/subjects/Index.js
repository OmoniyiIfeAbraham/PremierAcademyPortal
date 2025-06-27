const express = require("express");
const DetailModel = require("../../../../models/Subjects/Detail.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const subjects = await DetailModel.find({}).sort({ createdAt: -1 });
    console.log(subjects);
    res.render("admin/dashboard/subjects/View", { subjects });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/add", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.render("admin/dashboard/subjects/Add", { msg: "" });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.post("/add", async (req, res) => {
  const sess = req.session;
  const title = req.body.title;
  if (sess.email && sess.password && sess.identifier === "admin") {
    if (title == null) {
      res.render("admin/dashboard/subjects/Add", {
        msg: "Title cannot be empty",
      });
    } else {
      await DetailModel.create({ title: title });
      res.redirect("/portal/admin/dashboard/subjects");
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/edit/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier) {
    const subject = await DetailModel.findById(id);
    res.render("admin/dashboard/subjects/Edit", { subject, msg: "" });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.post("/edit/:id", async (req, res) => {
  const sess = req.session;
  const title = req.body.title;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "admin") {
    if (title == null) {
      res.render("admin/dashboard/subjects/Edit", {
        msg: "Title cannot be empty",
      });
    } else {
      await DetailModel.findByIdAndUpdate(id, { title: title });
      res.redirect("/portal/admin/dashboard/subjects");
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/delete/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier) {
    await DetailModel.findByIdAndDelete(id);
    res.redirect("/portal/admin/dashboard/subjects");
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
