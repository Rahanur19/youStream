const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Video = require("../models/video.model.js");
const Comment = require("../models/comment.model.js");
const Like = require("../models/like.model.js");
const cloudinaryFileUp = require("../utils/cloudinaryFileUp.js");
const cloudinaryFileDeleteById = require("../utils/cloudinaryFileDeleteById.js");
const { single } = require("../middlewares/multer.middleware.js");
const { extractPublicIdFromUrl } = require("../utils/extractUrl.js");

// Function to extract public_id from Cloudinary URL
// Example URL: https://res.cloudinary.com/<cloud_name>/video/upload/v1699999999/my_folder/my_video.mp4
// Extracted public_id: my_folder/my_video

// function extractPublicIdFromUrl(url) {
//   try {
//     const matches = url.match(/upload\/v\d+\/(.+)\.(\w+)$/);
//     if (!matches || matches.length < 2) return null;

//     return matches[1]; // this is the public_id
//   } catch (err) {
//     console.error("Failed to extract public_id:", err);
//     return null;
//   }
// }

const getAllVideos = asyncHandler(async (req, res) => {
  if (!req.user._id) {
    throw new ApiError(400, "User is not logged in");
  }
  const videos = await Video.find({ owner: req.user._id }).populate(
    "owner",
    "fullName userName email avatar"
  );

  if (!videos) {
    throw new ApiError(404, "No videos found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Videos fetched successfully", videos));
});

const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Video fetched successfully", video));
});

const createVideo = asyncHandler(async (req, res) => {
  // const videoLocal = req.files.video ? req.files.video[0].path : null;
  const videoFile = req.files.video ? req.files.video[0] : null;

  // const thumbnailLocal = req.files.thumbnail ? req.files.thumbnail[0].path : null;
  const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

  const title = req.body.title;
  const description = req.body.description;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  if (!videoFile || !thumbnailFile) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  // const video = await cloudinaryFileUp(videoLocal, "videos");
  const video = await cloudinaryFileUp(videoFile, "videos");

  // const thumbnail = await cloudinaryFileUp(thumbnailLocal, "thumbnails");
  const thumbnail = await cloudinaryFileUp(thumbnailFile, "thumbnails");

  if (!video || !thumbnail) {
    throw new ApiError(500, "Failed to upload video or thumbnail");
  }

  const duration = video.duration;

  const newVideo = {
    title,
    description,
    // videoFile: video.url,
    videoFile: video.secure_url,
    // thumbnail: thumbnail.url,
    thumbnail: thumbnail.secure_url,
    duration,
    owner: req.user._id,
  };

  const createdVideo = await Video.create(newVideo);

  if (!createdVideo) {
    throw new ApiError(500, "Failed to create video");
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Video created successfully", createdVideo));
});

const updateVideoById = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  const { title, description } = req.body;
  if (title) video.title = title;
  if (description) video.description = description;

  // Handle file uploads if any -- for video
  if (req.files.video) {
    // const videoLocal = req.files.video[0].path;
    const videoFile = req.files.video[0];
    const uploadedVideo = await cloudinaryFileUp(videoFile, "videos");
    if (uploadedVideo) {
      // Delete the old video from cloudinary
      const videoPublicId = extractPublicIdFromUrl(video.videoFile);
      if (videoPublicId) {
        const deletedFile = cloudinaryFileDeleteById(videoPublicId, "video");
        if (!deletedFile) {
          console.error("Failed to delete old video from Cloudinary");
        }
      }
      // video.videoFile = uploadedVideo.url;
      video.videoFile = uploadedVideo.secure_url;
      video.duration = uploadedVideo.duration;
    }
  }

  // Handle file uploads if any -- for thumbnail
  if (req.files.thumbnail) {
    // const thumbnailLocal = req.files.thumbnail[0].path;
    const thumbnailFile = req.files.thumbnail[0];
    const uploadedThumbnail = await cloudinaryFileUp(
      thumbnailFile,
      "thumbnails"
    );
    if (uploadedThumbnail) {
      // Delete the old thumbnail from cloudinary
      const thumbnailPublicId = extractPublicIdFromUrl(video.thumbnail);
      if (thumbnailPublicId) {
        const deletedFile = cloudinaryFileDeleteById(
          thumbnailPublicId,
          "image"
        );
        if (!deletedFile) {
          console.error("Failed to delete old thumbnail from Cloudinary");
        }
      }
      // video.thumbnail = uploadedThumbnail.url;
      video.thumbnail = uploadedThumbnail.secure_url;
    }
  }

  // Save the updated video
  const updatedVideo = await video.save({ validationBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, "Video updated successfully", updatedVideo));
});

const deleteVideoById = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }
  // Delete video file from Cloudinary
  const videoPublicId = extractPublicIdFromUrl(video.videoFile);
  if (videoPublicId) {
    const deletedVideo = await cloudinaryFileDeleteById(videoPublicId, "video");
    if (!deletedVideo) {
      console.error("Failed to delete video file from Cloudinary");
    }
  }

  // Delete thumbnail file from Cloudinary
  const thumbnailPublicId = extractPublicIdFromUrl(video.thumbnail);
  if (thumbnailPublicId) {
    const deletedThumbnail = await cloudinaryFileDeleteById(
      thumbnailPublicId,
      "image"
    );
  }

  //-----delete all other properties associated with this video -------
  // 1st : Find all comments of this video
  const comments = await Comment.find({ video: videoId }).select("_id");

  // 2nd : Delete all likes associated with these comments
  const commentIds = comments.map((c) => c._id);
  if (commentIds.length > 0) {
    await Like.deleteMany({ comment: { $in: commentIds } });
  }

  //3rd: Delete likes associated directly with the video
  await Like.deleteMany({ video: videoId });

  //4th: Delete all comments associated with the post
  await Comment.deleteMany({ video: videoId });

  //5th: Delete video document from database
  const deletedVideo = await video.deleteOne();
  if (!deletedVideo) {
    throw new ApiError(500, "Failed to delete video");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully", deletedVideo));
});

const togglePublishButton = asyncHandler(async (req, res) => {
  //   res.send("Toggle publish button endpoint is under construction");
  const videoId = req.params.videoId;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  video.isPublished = !video.isPublished;
  const updatedVideo = await video.save({ validationBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, "Video publish status toggled", updatedVideo));
});

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideoById,
  deleteVideoById,
  togglePublishButton,
};
