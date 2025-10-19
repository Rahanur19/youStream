// add comment to content
// remove comment from content
// update a comment
// get all comments of a content
// get single comment by id
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Comment = require("../models/comment.model.js");
const Video = require("../models/video.model.js");
const communityPostModel = require("../models/communityPost.model");
const mongoose = require("mongoose");
const Like = require("../models/like.model.js");

const createComment = asyncHandler(async (req, res) => {
  const contentId = req.params.videoIdOrCommunnityPostId;
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

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "No comment found with provided id");
  }
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();
  //delete all likes associated with this comment
  await Like.deleteMany({ comment: commentId });

  res.status(201).json(new ApiResponse(201, "Comment deleted successfully"));
});

const getAllComments = asyncHandler(async (req, res) => {
  const contentId = req.params.videoIdOrCommunnityPostId;
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ApiError(400, "Invalid content ID");
  }

  const video = await Video.findOne({ _id: contentId });
  const communityPost = await communityPostModel.findOne({ _id: contentId });

  if (!video && !communityPost) {
    throw new ApiError(404, "No video or community post found with the id");
  }

  const comments = await Comment.find({
    $or: [{ video }, { communityPost }],
  });

  res
    .status(201)
    .json(new ApiResponse(201, "comments fetched successfully", comments));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const commentContent = req.body.commentContent;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  if (!commentContent || commentContent.trim() === "") {
    throw new ApiError(401, "Comment content is needed");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "no comment found with provided id");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  comment.content = commentContent.trim();
  await comment.save();

  res
    .status(202)
    .json(new ApiResponse(202, "comment updated successfully", comment));
});

const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "no comment found with given id");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "comment fetched succesfully", comment));
});

module.exports = {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
  getCommentById,
};
