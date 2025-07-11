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

module.exports = { app };
