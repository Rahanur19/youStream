const express = require("express");
const Router = express.Router();

// Importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");

// Importing playlist controller functions
const {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} = require("../controllers/playlist.controller.js");

// Playlist routes
Router.post("/create-playlist", verifyJWT, createPlaylist);
Router.get("/all-playlists", verifyJWT, getAllPlaylists);
Router.get("/playlist/:playlistId", verifyJWT, getPlaylistById);
Router.put("/update-playlist/:playlistId", verifyJWT, updatePlaylistById);
Router.delete("/delete-playlist/:playlistId", verifyJWT, deletePlaylistById);
Router.post("/add-video/:playlistId", verifyJWT, addVideoToPlaylist);
Router.post(
  "/remove-video/:playlistId/:videoId",
  verifyJWT,
  removeVideoFromPlaylist
);

module.exports = Router;
