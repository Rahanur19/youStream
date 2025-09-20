const express = require("express");
const Router = express.Router();

// importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");

// importing controllers
const {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
  getCommentById,
} = require("../controllers/comment.controller.js");

// handling routes
Router.post(
  "/create-comment/:videoIdOrCommunnityPostId",
  verifyJWT,
  createComment
);
Router.delete("/delete-comment/:commentId", verifyJWT, deleteComment);
Router.get(
  "/all-comments/:videoIdOrCommunnityPostId",
  verifyJWT,
  getAllComments
);
Router.put("/update-comment/:commentId", verifyJWT, updateComment);
Router.get("/comment/:commentId", verifyJWT, getCommentById);

module.exports = Router;
