const express = require("express");
const Router = express.Router();

// Importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");

// Importing like controller functions
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
} = require("../controllers/communityPost.controller.js");

// Like routes
Router.post("/create-post", verifyJWT, createPost);
Router.get("/all-posts", verifyJWT, getAllPosts);
Router.get("/post/:postId", verifyJWT, getPostById);
Router.put("/update-post/:postId", verifyJWT, updatePostById);
Router.delete("/delete-post/:postId", verifyJWT, deletePostById);

module.exports = Router;
