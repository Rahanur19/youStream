const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { userRegister } = require("./controllers/user.controller.js");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(cookieParser({}));
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ extended: true, limit: "24kb" }));
app.use(express.static("public"));

//import routes
const userRoutes = require("./routes/user.routes.js");
app.use("/api/v1/users", userRoutes);

module.exports = { app };
