const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Like = require("../models/like.model.js");
const CommunityPost = require("../models/communityPost.model.js");
const Comment = require("../models/comment.model.js");
const mongoose = require("mongoose");

const createPost = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || !user._id) {
    throw new ApiError(401, "User is not authenticated");
  }
  const { title, content } = req.body;
  if (!title || title.trim().length === 0) {
    throw new ApiError(400, "Title is required");
  }
  if (!content || content.trim().length === 0) {
    throw new ApiError(400, "Content is required");
  }
  const newPost = await CommunityPost.create({
    content: content.trim(),
    owner: user._id,
    title: title.trim(),
  });
  if (!newPost) {
    throw new ApiError(500, "Failed to create community post");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Community post created successfully", newPost));
});
const getAllPosts = asyncHandler(async (req, res) => {
  // Return all community posts (most recent first). Populate owner for client use.
  const posts = await CommunityPost.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate("owner", "_id userName fullName avatar");
  res
    .status(200)
    .json(new ApiResponse(200, "Community posts fetched successfully", posts));
});
const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }
  const post = await CommunityPost.findById(postId);
  if (!post) {
    throw new ApiError(404, "Community post not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Community post fetched successfully", post));
});
const updatePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content, title } = req.body;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }
  // Require at least one field to update
  if (
    (content === undefined ||
      content === null ||
      String(content).trim() === "") &&
    (title === undefined || title === null || String(title).trim() === "")
  ) {
    throw new ApiError(
      400,
      "At least one of title or content must be provided"
    );
  }
  // if (!title || title.trim().length === 0) {
  //   throw new ApiError(400, "Title is required");
  // }

  const post = await CommunityPost.findById(postId);
  if (!post) {
    throw new ApiError(404, "Community post not found");
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }
  const updates = {};
  if (
    title !== undefined &&
    String(title).trim() !== "" &&
    post.title.trim() !== String(title).trim()
  ) {
    updates.title = String(title).trim();
  }
  if (
    content !== undefined &&
    String(content).trim() !== "" &&
    post.content.trim() !== String(content).trim()
  ) {
    updates.content = String(content).trim();
  }
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No changes detected in title or content");
  }
  Object.assign(post, updates);
  await post.save();
  // post.content = content.trim();
  // post.title = title.trim();
  res
    .status(200)
    .json(new ApiResponse(200, "Community post updated successfully", post));
});
const deletePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }
  const post = await CommunityPost.findById(postId);
  if (!post) {
    throw new ApiError(404, "Community post not found");
  }
  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }
  //-----delete all other properties associated with this post -------
  // 1st : Find all comments of this post
  const comments = await Comment.find({ communityPost: postId }).select("_id");

  // 2nd : Delete all likes associated with these comments
  const commentIds = comments.map((c) => c._id);
  if (commentIds.length > 0) {
    await Like.deleteMany({ comment: { $in: commentIds } });
  }

  //3rd: Delete likes associated directly with the post
  await Like.deleteMany({ communityPost: postId });

  //4th: Delete all comments associated with the post
  await Comment.deleteMany({ communityPost: postId });

  //5th: Finally, delete the post itself
  await post.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, "Community post deleted successfully", null));
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
