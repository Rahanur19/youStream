// create, read, update, delete playlist
// add video to playlist
// remove video from playlist
// get all playlist of a user
// get single playlist by id

const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Playlist = require("../models/playlist.model.js");
const Video = require("../models/video.model.js");
const mongoose = require("mongoose");

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (
    (!name || name.trim().length === 0) &&
    (!description || description.trim().length === 0)
  ) {
    throw new ApiError(400, "Playlist name and description are required");
  }

  const existingPlaylist = await Playlist.findOne({
    name: name.trim(),
    owner: req.user._id,
  });

  if (existingPlaylist) {
    throw new ApiError(400, "Playlist with this name already exists");
  }

  const newPlaylist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: req.user._id,
  });

  if (!newPlaylist) {
    throw new ApiError(500, "Failed to create playlist");
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Playlist created successfully", newPlaylist));
});

const getAllPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  if (!playlists) {
    throw new ApiError(404, "No playlists found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Playlists fetched successfully", playlists));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  const playlist = await Playlist.findById(playlistId).populate("videos");
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
});

const updatePlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  if (
    (!name || name.trim().length === 0) &&
    (!description || description.trim().length === 0)
  ) {
    throw new ApiError(400, "Playlist name or description is required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }
  if (name && name.trim().length > 0)
    playlist.name = name.replace(/\s+/g, " ").trim();
  if (description && description.trim().length > 0)
    playlist.description = description.trim();
  await playlist.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Playlist updated successfully", playlist));
});

const deletePlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }

  const deletedPlaylist = await playlist.deleteOne();
  res
    .status(200)
    .json(
      new ApiResponse(200, "Playlist deleted successfully", deletedPlaylist)
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { videoId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  }
  playlist.videos.push(videoId);
  await playlist.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, "Video added to playlist successfully", playlist)
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete video from this playlist"
    );
  }
  const videoIndex = playlist.videos.indexOf(videoId);
  if (videoIndex === -1) {
    throw new ApiError(404, "Video not found in playlist");
  }
  playlist.videos.splice(videoIndex, 1);
  await playlist.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, "Video removed from playlist successfully", playlist)
    );
});

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
