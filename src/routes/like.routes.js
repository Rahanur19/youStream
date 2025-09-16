const express = require("express");
const Router = express.Router();

// Importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");

// Importing like controller functions
const {
  toggleVideoLike,
  toggleCommentLike,
  toggleCommunityPostLike,
  countLikesByVideoId,
  countLikesByCommentId,
  countLikesByCommunityPostId,
  getAllLikedVideosByUser,
} = require("../controllers/like.controller.js");

// Like routes
Router.post("/video/:videoId", verifyJWT, toggleVideoLike);
Router.post("/comment/:commentId", verifyJWT, toggleCommentLike);
Router.post(
  "/community-post/:communityPostId",
  verifyJWT,
  toggleCommunityPostLike
);
Router.get("/video/:videoId", verifyJWT, countLikesByVideoId);
Router.get("/comment/:commentId", verifyJWT, countLikesByCommentId);
Router.get(
  "/community-post/:communityPostId",
  verifyJWT,
  countLikesByCommunityPostId
);
Router.get("/liked-videos", verifyJWT, getAllLikedVideosByUser);

module.exports = Router;
