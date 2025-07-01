const express = require("express");
const StudentProfileModel = require("../../../models/Students/StudentProfile.model");
const ClassDetailModel = require("../../../models/Classes/ClassDetail.model");
const InfoModel = require("../../../models/Assignments/Info.model");
const DetailModel = require("../../../models/Subjects/Detail.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "student") {
    const student = await StudentProfileModel.findOne({ email: sess.email });
    const classs = await ClassDetailModel.findById(student.class);
    res.render("student/dashboard/Dashboard", { student, classs });
  } else {
    res.redirect("/");
  }
});

router.get("/assignments", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "student") {
    const student = await StudentProfileModel.findOne({ email: sess.email });
    const assignments = await InfoModel.find({ student: student._id });
    const classes = await ClassDetailModel.find({});
    const subjects = await DetailModel.find({});
    res.render("student/assignments/Index", { assignments, classes, subjects });
  } else {
    res.redirect("/");
  }
});

router.get("/assignments/add", async (req, res) => {
  const sess = req.session;
  if (sess.email && sess.password && sess.identifier === "student") {
    const student = await StudentProfileModel.findOne({ email: sess.email });
    const classs = await ClassDetailModel.findById({ _id: student.class });
    res.render("student/assignments/Submit", { student, msg: "", classs });
  } else {
    res.redirect("/");
  }
});

router.post("/add", async (req, res) => {
  const sess = req.session;
  const title = req.body.title;
  const description = req.body.description;
  const subject = req.body.subject;
  //   console.log(name, Subjects, teacher);
  if (sess.email && sess.password && sess.identifier === "student") {
    const student = await StudentProfileModel.findOne({ email: sess.email });
    const classs = await ClassDetailModel.findById({ _id: student.class });
    if (title == null || subject == null) {
      res.render("student/assignments/Submit", {
        msg: "Title and Subject fields are all required",
        classs,
        student,
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
    res.redirect("/");
  }
});

module.exports = router;
