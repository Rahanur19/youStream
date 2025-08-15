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
router.post("/logout", verifyJWT, userLogout);

module.exports = router;
