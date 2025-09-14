const express = require("express");
const { ApiResponse } = require("../utils/ApiResponse.js");
const router = express.Router();

// Importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/multer.middleware");

// Importing user controller functions
const {
  userRegister,
  userLogin,
  userLogout,
  resetAccessToken,
  changePassword,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  getChannelDetails,
  getWatchHistory,
} = require("../controllers/user.controller.js");

// User routes
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegister
);

router.post("/login", userLogin);

//secured routes
router.post("/logout", verifyJWT, userLogout);
router.post("/refresh-token", verifyJWT, resetAccessToken);
router.post("/change-password", verifyJWT, changePassword);
router.get("/current-user", verifyJWT, getCurrentUser);
router.patch("/update-profile", verifyJWT, updateUserProfile);
router.patch(
  "update-avatar",
  upload.single("avatar"),
  verifyJWT,
  updateUserAvatar
);
router.patch(
  "/update-cover-image",
  upload.single("coverImage"),
  verifyJWT,
  updateUserAvatar
);

router.get("/channel/:username", verifyJWT, getChannelDetails);
router.get("/watch-history", verifyJWT, getWatchHistory);
module.exports = router;

//register, login, logout, refresh token, change password, get current user, update profile, update avatar, update cover image, get user channel by username, get watch history
