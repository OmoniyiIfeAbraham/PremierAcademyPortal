const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    res.render("admin/dashboard/index");
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
