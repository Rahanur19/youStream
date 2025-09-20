const express = require("express");
const Router = express.Router();

// importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");

// importing controllers
const { createComment } = require("../controllers/comment.controller.js");

// handling routes
Router.post(
  "/create-comment/:videoIdOrCommunnityPostId",
  verifyJWT,
  createComment
);

module.exports = Router;
