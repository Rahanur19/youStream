const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Like = require("../models/like.model.js");
const Video = require("../models/video.model.js");
const CommunityPost = require("../models/communityPost.model.js");
const Comment = require("../models/comment.model.js");
const mongoose = require("mongoose");

const toggleLike = async ({
  req,
  res,
  contentId,
  contentField,
  ContentModel,
}) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ApiError(400, "Invalid content ID");
  }
  const content = await ContentModel.findById(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  const existingLike = await Like.findOne({
    [contentField]: contentId,
    likedBy: userId,
  });

  if (existingLike) {
    // If like exists, remove it (unlike)
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, "Content unliked successfully", null));
  }

  // If like doesn't exist, create it (like)
  const newLike = await Like.create({
    [contentField]: contentId,
    likedBy: userId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Content liked successfully", newLike));
};

const countLikes = async ({ req, res, contentField, contentId }) => {
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ApiError(400, "Invalid content ID");
  }
  const likeCount = await Like.countDocuments({ [contentField]: contentId });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Like count fetched successfully", { likeCount })
    );
};

//------------------- Individual Controllers -------------------//
/*
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });
  if (existingLike) {
    // If like exists, remove it (unlike)
    await existingLike.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Video unliked successfully", null));
  } else {
    // If like doesn't exist, create it (like)
    const newLike = Like.create({ video: videoId, likedBy: userId });
    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Video liked successfully", newLike));
  }
});
*/
const toggleVideoLike = asyncHandler(async (req, res) => {
  await toggleLike({
    req,
    res,
    contentId: req.params.videoId,
    contentField: "video",
    ContentModel: Video,
  });
});
const toggleCommentLike = asyncHandler(async (req, res) => {
  await toggleLike({
    req,
    res,
    contentId: req.params.commentId,
    contentField: "comment",
    ContentModel: Comment,
  });
});
const toggleCommunityPostLike = asyncHandler(async (req, res) => {
  await toggleLike({
    req,
    res,
    contentId: req.params.communityPostId,
    contentField: "communityPost",
    ContentModel: CommunityPost,
  });
});
const countLikesByVideoId = asyncHandler(async (req, res) => {
  await countLikes({
    req,
    res,
    contentField: "video",
    contentId: req.params.videoId,
  });
});
const countLikesByCommentId = asyncHandler(async (req, res) => {
  await countLikes({
    req,
    res,
    contentField: "comment",
    contentId: req.params.commentId,
  });
});
const countLikesByCommunityPostId = asyncHandler(async (req, res) => {
  await countLikes({
    req,
    res,
    contentField: "communityPost",
    contentId: req.params.communityPostId,
  });
});
const getAllLikedVideosByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const likesForVideos = await Like.find({
    likedBy: userId,
    video: { $ne: null },
  });
  if (!likesForVideos || likesForVideos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No liked videos found", []));
  }
  const videoIds = likesForVideos.map((like) => like.video);
  const likedVideos = await Video.find({ _id: { $in: videoIds } }).populate(
    "owner",
    "fullName userName email avatar"
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, "Liked videos fetched successfully", likedVideos)
    );
});

module.exports = {
  toggleVideoLike,
  toggleCommentLike,
  toggleCommunityPostLike,
  countLikesByVideoId,
  countLikesByCommentId,
  countLikesByCommunityPostId,
  getAllLikedVideosByUser,
};
