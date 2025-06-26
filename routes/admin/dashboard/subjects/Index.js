const express = require("express");
const DetailModel = require("../../../../models/Subjects/Detail.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.render("admin/dashboard/subjects/View");
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
      const newSubject = DetailModel.create({ title: title });
      await newSubject.save();
      res.redirect("/portal/admin/dashboard/subjects");
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
