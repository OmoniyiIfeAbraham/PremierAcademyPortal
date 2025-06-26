const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.render("admin/dashboard/teachers/View");
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/add", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.render("admin/dashboard/teachers/Add");
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
