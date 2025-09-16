const express = require("express");
const Router = express.Router();

// Importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/multer.middleware.js");

// Importing video controller functions
const {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideoById,
  deleteVideoById,
  togglePublishButton,
} = require("../controllers/video.controller.js");

// Video routes
Router.get("/all-videos", verifyJWT, getAllVideos);
Router.get("/:videoId", verifyJWT, getVideoById);
Router.post(
  "/upload-video",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifyJWT,
  createVideo
);

Router.put(
  "/update-video/:videoId",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifyJWT,
  updateVideoById
);

Router.delete("/delete-video/:videoId", verifyJWT, deleteVideoById);
Router.patch("/toggle-publish/:videoId", verifyJWT, togglePublishButton);

module.exports = Router;
