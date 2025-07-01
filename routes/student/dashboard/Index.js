const express = require("express");
const StudentProfileModel = require("../../../models/Students/StudentProfile.model");
const ClassDetailModel = require("../../../models/Classes/ClassDetail.model");
const InfoModel = require("../../../models/Assignments/Info.model");
const DetailModel = require("../../../models/Subjects/Detail.model");
const cloudinary = require("cloudinary");
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
    const assignments = await InfoModel.find({ student: student._id }).sort({
      createdAt: -1,
    });
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

router.post("/assignments/add", async (req, res) => {
  const sess = req.session;
  const title = req.body.title;
  const description = req.body.description;
  const subject = req.body.subject;

  console.log("File: ", req.files);
  console.log("Body: ", req.body);

  if (sess.email && sess.password && sess.identifier === "student") {
    try {
      const student = await StudentProfileModel.findOne({ email: sess.email });
      const classs = await ClassDetailModel.findById({ _id: student.class });

      // Validation
      if (!title || !subject) {
        return res.render("student/assignments/Submit", {
          msg: "Title and Subject fields are required",
          classs,
          student,
        });
      }

      let fileUrl = null;
      let filePublicId = null;

      // Check if file was uploaded
      if (req.files && req.files.file) {
        const uploadedFile = req.files.file;

        // Define allowed file types
        const allowedImageTypes = [
          "image/apng",
          "image/avif",
          "image/gif",
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/webp",
        ];

        const allowedDocumentTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
          "application/msword", // .doc
          "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
          "application/vnd.ms-powerpoint", // .ppt
          "text/plain", // .txt
        ];

        const isImage = allowedImageTypes.includes(uploadedFile.mimetype);
        const isDocument = allowedDocumentTypes.includes(uploadedFile.mimetype);

        if (isImage || isDocument) {
          try {
            // Determine upload parameters based on file type
            const uploadParams = {
              use_filename: false,
              unique_filename: true,
            };

            if (isImage) {
              uploadParams.resource_type = "image";
              uploadParams.folder = process.env.imagesFolder;
            } else if (isDocument) {
              uploadParams.resource_type = "raw"; // Use 'raw' for documents
              uploadParams.folder = process.env.documentFolder;
            }

            // Upload to Cloudinary
            const upload = await cloudinary.v2.uploader.upload(
              uploadedFile.tempFilePath,
              uploadParams
            );

            console.log("Upload: ", upload);

            fileUrl = upload.secure_url;
            filePublicId = upload.public_id;
          } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return res.render("student/assignments/Submit", {
              msg: "File upload failed. Please try again.",
              classs,
              student,
            });
          }
        } else {
          return res.render("student/assignments/Submit", {
            msg: "Invalid file type. Please upload images (PNG, JPG, GIF, etc.) or documents (PDF, DOCX, etc.)",
            classs,
            student,
          });
        }
      }

      // Create assignment submission record
      const assignmentSubmission = new InfoModel({
        student: student._id, // or student.name depending on your schema preference
        title: title,
        description: description || "",
        file: fileUrl,
        filePublicId: filePublicId,
        subject: subject,
        class: student.class,
        grade: 0, // Default grade, can be updated later by teacher
      });

      await assignmentSubmission.save();

      res.redirect("/portal/student/dashboard/assignments");
    } catch (error) {
      console.error("Assignment submission error:", error);
      const student = await StudentProfileModel.findOne({ email: sess.email });
      const classs = await ClassDetailModel.findById({ _id: student.class });

      res.render("student/assignments/Submit", {
        msg: "An error occurred while submitting assignment. Please try again.",
        classs,
        student,
      });
    }
  } else {
    res.redirect("/");
  }
});

// Optional: Add a route to delete assignment and its file from Cloudinary
// router.delete("/delete/:id", async (req, res) => {
//   const sess = req.session;
//   const assignmentId = req.params.id;

//   if (sess.email && sess.password && sess.identifier === "student") {
//     try {
//       const assignment = await AssignmentInfo.findById(assignmentId);

//       if (!assignment) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Assignment not found" });
//       }

//       // Verify the assignment belongs to the current student
//       const student = await StudentProfileModel.findOne({ email: sess.email });
//       if (assignment.student !== student._id.toString()) {
//         return res
//           .status(403)
//           .json({ success: false, message: "Unauthorized" });
//       }

//       // Delete file from Cloudinary if it exists
//       if (assignment.filePublicId) {
//         try {
//           await cloudinary.uploader.destroy(assignment.filePublicId);
//         } catch (deleteError) {
//           console.error("Cloudinary delete error:", deleteError);
//         }
//       }

//       // Delete assignment from database
//       await AssignmentInfo.findByIdAndDelete(assignmentId);

//       res.json({ success: true, message: "Assignment deleted successfully" });
//     } catch (error) {
//       console.error("Assignment deletion error:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Error deleting assignment" });
//     }
//   } else {
//     res.status(401).json({ success: false, message: "Unauthorized" });
//   }
// });

module.exports = router;
