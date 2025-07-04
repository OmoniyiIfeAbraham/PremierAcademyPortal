const express = require("express");
const bcrypt = require("bcrypt");
const ProfileModel = require("../../../models/Teachers/Profile.model");
const router = express.Router();

router.post("/", async (req, res) => {
  const sess = req.session;
  const email = req.body.email;
  const password = req.body.password;
  //   console.log(req.body)
  let teacher = await ProfileModel.findOne({ email: email });
  let checkPassword = bcrypt.compareSync(password, teacher.password);
  if (!teacher) {
    res.render("general/Home", { msg: "User doesn't exist" });
  } else if (!checkPassword) {
    res.render("general/Home", { msg: "Incorrect Password" });
  } else {
    sess.email = email;
    sess.password = password;
    sess.identifier = "teacher";
    res.redirect("/portal/teacher/dashboard");
  }
});

module.exports = router;
