const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
const videoRoutes = require("./routes/video.routes.js");
const likeRoutes = require("./routes/like.routes.js");

//routes
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/likes", likeRoutes);

module.exports = { app };
