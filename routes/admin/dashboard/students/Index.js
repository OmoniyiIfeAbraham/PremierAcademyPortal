const express = require("express");
const ProfileModel = require("../../../../models/Teachers/Profile.model");
const ClassDetailModel = require("../../../../models/Classes/ClassDetail.model");
const DetailModel = require("../../../../models/Subjects/Detail.model");
const mailer = require("nodemailer");
const bcrypt = require("bcrypt");
const StudentProfileModel = require("../../../../models/Students/StudentProfile.model");
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
    const students = await StudentProfileModel.find({}).sort({ createdAt: -1 });
    const classes = await ClassDetailModel.find({});
    res.render("admin/dashboard/students/View", { students, classes });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/add", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const classes = await ClassDetailModel.find({}).sort({ createdAt: -1 });
    res.render("admin/dashboard/students/Add", { classes, msg: "" });
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
  const classs = req.body.class;
  //   console.log(name, Subjects, teacher);
  if (sess.email && sess.password && sess.identifier === "admin") {
    const classes = await ClassDetailModel.find({}).sort({ createdAt: -1 });
    const checkMail = await StudentProfileModel.findOne({ email: email });
    const checkPhone = await StudentProfileModel.findOne({ phone: phone });
    if (
      name == null ||
      email == null ||
      password == null ||
      phone == null ||
      classs == null
    ) {
      res.render("admin/dashboard/students/Add", {
        msg: "Name, Email, Password, Phone Number, and Class fields are all required",
        classes,
      });
    } else if (phone.length !== 11) {
      res.render("admin/dashboard/students/Add", {
        msg: "Phone Number must be 11 digits",
        classes,
      });
    } else if (password.length < 8) {
      res.render("admin/dashboard/students/Add", {
        msg: "Password must be at least 8 characters long",
        classes,
      });
    } else if (checkMail) {
      res.render("admin/dashboard/students/Add", {
        msg: "Email already exists",
        classes,
      });
    } else if (checkPhone) {
      res.render("admin/dashboard/students/Add", {
        msg: "Phone Number already exists",
        classes,
      });
    } else {
      await StudentProfileModel.create({
        name: name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        phone: phone,
        class: classs,
      });
      async function mail() {
        const mailOption = {
          from: `${process.env.adminName} ${process.env.email}`,
          to: email,
          subject: `${name} - Student Login Details`,
          html: `
                    <body>
                        <center><h3>Hello ${name} Your Account has been created successfully. Below are your login details. </h3> <p> Visit </p> <a href="${process.env.link}/login/student">Login as Student</a> <p>Email: ${email}</p> <p>Password: ${password}</p></center>
                    </body>
                `,
        };
        await systemMail.sendMail(mailOption);
      }
      mail();
      res.redirect("/portal/admin/dashboard/students");
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/view/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const student = await StudentProfileModel.findById(id);
    const classes = await ClassDetailModel.find({});
    const classs = await ClassDetailModel.findOne({ _id: student.class });
    // console.log(classs);
    res.render("admin/dashboard/students/ViewSingle", {
      student,
      classes,
      classs,
    });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/edit/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier) {
    const student = await StudentProfileModel.findById(id);
    const classes = await ClassDetailModel.find({}).sort({ createdAt: -1 });
    res.render("admin/dashboard/students/Edit", {
      student,
      msg: "",
      classes,
    });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.post("/edit/:id", async (req, res) => {
  const sess = req.session;
  const name = req.body.name;
  const classs = req.body.class;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const student = await StudentProfileModel.findById(id);
    const classes = await ClassDetailModel.find({}).sort({ createdAt: -1 });
    if (name == null || classs == null) {
      res.render("admin/dashboard/students/Edit", {
        msg: "Name and Class fields are all required",
        classes,
        student,
      });
    } else {
      await StudentProfileModel.findByIdAndUpdate(id, {
        name: name,
        class: classs,
      });
      res.redirect(`/portal/admin/dashboard/students/view/${id}`);
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/edit_password/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier) {
    const student = await StudentProfileModel.findById(id);
    res.render("admin/dashboard/students/EditPassword", {
      student,
      msg: "",
    });
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.post("/edit_password/:id", async (req, res) => {
  const sess = req.session;
  const password = req.body.password;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier === "admin") {
    const student = await StudentProfileModel.findById(id);
    if (password == null || password.length < 8) {
      res.render("admin/dashboard/students/EditPassword", {
        msg: "Password must be at least 8 characters long",
        student,
      });
    } else {
      await StudentProfileModel.findByIdAndUpdate(id, {
        password: bcrypt.hashSync(password, 10),
      });
      async function mail() {
        const mailOption = {
          from: `${process.env.adminName} ${process.env.email}`,
          to: student.email,
          subject: `${student.name} - Updated Student Login Details`,
          html: `
                    <body>
                        <center><h3>Hello ${student.name} Your Account password been updated. Below are your new login details. </h3> <p> Visit </p> <a href="${process.env.link}/login/student">Login as Teacher</a> <p>Email: ${student.email}</p> <p>Password: ${password}</p></center>
                    </body>
                `,
        };
        await systemMail.sendMail(mailOption);
      }
      mail();
      res.redirect(`/portal/admin/dashboard/students/view/${id}`);
    }
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

router.get("/delete/:id", async (req, res) => {
  const sess = req.session;
  const id = req.params.id;
  if (sess.email && sess.password && sess.identifier) {
    await StudentProfileModel.findByIdAndDelete(id);
    res.redirect(`/portal/admin/dashboard/students`);
  } else {
    res.redirect("/portal/admin/auth/login");
  }
});

module.exports = router;
