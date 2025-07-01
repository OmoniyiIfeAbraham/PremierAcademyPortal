const express = require("express");
const app = express();

// dotenv
require("dotenv").config();

const PORT = process.env.PORT;

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// cloudinary
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// morgan
app.use(require("morgan")("dev"));

// express-session
app.use(
  require("express-session")({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 568036800 },
  })
);

// express-fileupload
app.use(require("express-fileupload")({ useTempFiles: true }));

// mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.mongo_link).then((res) => {
  if (res) {
    console.log("Database Connected Succesfully");
    app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`));
  } else {
    console.log("Database not Connected");
  }
});

// templating
app.set("view engine", "ejs");
app.use(express.static("public"));

// ROUTES
// Admin
app.use("/portal/admin/auth/login", require("./routes/admin/auth/Login"));
app.use("/portal/admin/dashboard", require("./routes/admin/dashboard/Index"));
app.use(
  "/portal/admin/dashboard/teachers",
  require("./routes/admin/dashboard/teachers/Index")
);
app.use(
  "/portal/admin/dashboard/subjects",
  require("./routes/admin/dashboard/subjects/Index")
);
app.use(
  "/portal/admin/dashboard/classes",
  require("./routes/admin/dashboard/classes/Index")
);
app.use(
  "/portal/admin/dashboard/students",
  require("./routes/admin/dashboard/students/Index")
);
//GENERAL
app.use("/", require("./routes//general/Index"));
// STUDENT
app.use("/portal/student/auth/login", require("./routes/student/auth/Login"));
app.use(
  "/portal/student/dashboard",
  require("./routes/student/dashboard/Index")
);
