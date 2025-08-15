const express = require("express");
const router = express.Router();
const { userRegister } = require("../controllers/user.controller.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const upload = require("../middlewares/multer.middleware");

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegister
);

module.exports = router;
