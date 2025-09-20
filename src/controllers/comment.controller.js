// add comment to content
// remove comment from content
// get all comments of a content
// get single comment by id
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Comment = require("../models/comment.model.js");
const Video = require("../models/video.model.js");
const communityPostModel = require("../models/communityPost.model");
const mongoose = require("mongoose");

const createComment = asyncHandler(async (req, res) => {
  // console.log("Content-Type:", req.headers["content-type"]);
  // console.log("Raw body:", req.body);
  // return;
  const contentId = req.params.videoIdOrCommunnityPostId;
  console.log(req.body);
  const commentContent = req.body.commentContent;
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ApiError(400, "Invalid content ID");
  }

  if (!commentContent || commentContent.trim() === "") {
    throw new ApiError(401, "Comment content is needed");
  }

  const video = await Video.findOne({ _id: contentId });
  const communityPost = await communityPostModel.findOne({ _id: contentId });

  if (!video && !communityPost) {
    throw ApiError(404, "No video or community post found with the id");
  }

  const newComment = await Comment.create({
    content: commentContent.trim(),
    video: video ? video._id : null,
    communityPost: communityPost ? communityPost._id : null,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Comment created succesfully", newComment));
});

module.exports = {
  createComment,
};
