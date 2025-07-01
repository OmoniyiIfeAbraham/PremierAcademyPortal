const express = require("express");
const StudentProfileModel = require("../../../models/Students/StudentProfile.model");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const sess = req.session;
  const email = req.body.email;
  const password = req.body.password;
  //   console.log(req.body)
  let student = await StudentProfileModel.findOne({ email: email });
  let checkPassword = bcrypt.compareSync(password, student.password);
  if (!student) {
    res.render("general/Home", { msg: "User doesn't exist" });
  } else if (!checkPassword) {
    res.render("general/Home", { msg: "Incorrect Password" });
  } else {
    sess.email = email;
    sess.password = password;
    sess.identifier = "student";
    res.redirect("/portal/student/dashboard");
  }
});

module.exports = router;
