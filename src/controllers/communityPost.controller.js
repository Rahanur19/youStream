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
  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    throw new ApiError(400, "Content is required");
  }
  const newPost = await CommunityPost.create({
    content: content.trim(),
    owner: user._id,
  });
  if (!newPost) {
    throw new ApiError(500, "Failed to create community post");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Community post created successfully", newPost));
});
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });
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
  const { content } = req.body;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }
  if (!content || content.trim().length === 0) {
    throw new ApiError(400, "Content is required");
  }

  const post = await CommunityPost.findById(postId);
  if (!post) {
    throw new ApiError(404, "Community post not found");
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }
  post.content = content.trim();
  await post.save();
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
