const express = require("express");
const ProfileModel = require("../../../../models/Teachers/Profile.model");
const ClassDetailModel = require("../../../../models/Classes/ClassDetail.model");
const DetailModel = require("../../../../models/Subjects/Detail.model");
const mailer = require("nodemailer");
const bcrypt = require("bcrypt");
const router = express.Router();

const systemMail = mailer.createTransport({
  service: process.env.service,
  host: process.env.host,
  port: 465,
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const teachers = await ProfileModel.find({}).sort({ createdAt: -1 });
    res.render("admin/dashboard/teachers/View", { teachers });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/add", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const classes = await ClassDetailModel.find({}).sort({ createdAt: -1 });
    const subjects = await DetailModel.find({}).sort({ createdAt: -1 });
    res.render("admin/dashboard/teachers/Add", { classes, subjects, msg: "" });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.post("/add", async (req, res) => {
  const sess = req.session;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const role = req.body.role;
  const Subjects = req.body.subjects;
  const Classes = req.body.classes;
  //   console.log(name, Subjects, teacher);
  if (sess.email && sess.password && sess.identifier === "admin") {
    const subjects = await DetailModel.find({}).sort({ createdAt: -1 });
    const classes = await ClassDetailModel.find({}).sort({ createdAt: -1 });
    if (
      name == null ||
      email == null ||
      password == null ||
      phone == null ||
      Subjects.length <= 0 ||
      Classes.length <= 0
    ) {
      res.render("admin/dashboard/teachers/Add", {
        msg: "Name, Email, Password, Phone Number, Subjects and Classes fields are all required",
        subjects,
        classes,
      });
    } else if (phone.length !== 11) {
      res.render("admin/dashboard/teachers/Add", {
        msg: "Phone Number must be 11 digits",
        subjects,
        classes,
      });
    } else if (password.length < 8) {
      res.render("admin/dashboard/teachers/Add", {
        msg: "Password must be at least 8 characters long",
        subjects,
        classes,
      });
    } else if (Subjects.length <= 0) {
      res.render("admin/dashboard/teachers/Add", {
        msg: "Subjects cannot be empty",
        subjects,
        classes,
      });
    } else if (Classes.length <= 0) {
      res.render("admin/dashboard/teachers/Add", {
        msg: "Classes cannot be empty",
        subjects,
        classes,
      });
    } else {
      await ProfileModel.create({
        name: name,
        subjects: Subjects,
        email: email,
        password: bcrypt.hashSync(password, 10),
        phone: phone,
        classes: Classes,
        role: role,
      });
      async function mail() {
        const mailOption = {
          from: `${process.env.adminName} ${process.env.email}`,
          to: email,
          subject: `${name} - Teacher Login Details`,
          html: `
                    <body>
                        <center><h3>Hello ${name} Your Account has been created successfully. Below are your login details. </h3> <p> Visit </p> <a href="${process.env.link}/login/teacher">Login as Teacher</a> <p>Email: ${email}</p> <p>Password: ${password}</p></center>
                    </body>
                `,
        };
        await systemMail.sendMail(mailOption);
      }
      mail();
      res.redirect("/portal/admin/dashboard/teachers");
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/view/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const teacher = await ProfileModel.findById(id);
    // console.log(classs);
    res.render("admin/dashboard/teachers/ViewSingle", { teacher });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
