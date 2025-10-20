const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler.js");
const cloudinaryFileUp = require("../utils/cloudinaryFileUp.js");
const {
  generateAccessRefreshToken,
} = require("../utils/generateAccessRefreshToken.js");
const { extractPublicIdFromUrl } = require("../utils/extractUrl.js");
const cloudinaryFileDeleteById = require("../utils/cloudinaryFileDeleteById.js");

// cookie options: secure and sameSite should be relaxed in development so browsers accept them
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const userRegister = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some(
      (element) => element?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All input fields are requied");
  }

  const userAlreadyExists = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (userAlreadyExists) {
    throw new ApiError(409, "User already exists with given username or email");
  }

  // const avatarLocal = req.files?.avatar ? req.files.avatar[0].path : null;
  const avatarFile = req.files?.avatar ? req.files.avatar[0] : null;
  const coverFile = req.files?.coverImage ? req.files.coverImage[0] : null;

  if (!avatarFile) {
    throw new ApiError(400, "Avatar image is required");
  }

  // Upload avatar (required) and cover image (optional). Protect against missing buffers.
  let avatar;
  try {
    if (!avatarFile || !avatarFile.buffer) {
      throw new ApiError(
        400,
        "Avatar image is required and must be a valid file upload"
      );
    }
    avatar = await cloudinaryFileUp(avatarFile);
  } catch (err) {
    // cloudinaryFileUp rejects with string or Error. Normalize.
    const message = err?.message || err || "Failed to upload avatar image";
    throw new ApiError(500, message);
  }

  let cover = null;
  if (coverFile && coverFile.buffer) {
    try {
      cover = await cloudinaryFileUp(coverFile);
    } catch (err) {
      // If cover upload fails, log and continue without blocking registration.
      console.error("Cover image upload failed:", err);
      cover = null;
    }
  }

  const userData = {
    fullName,
    userName,
    email,
    password,
    // avatar: avatar.url,
    avatar: avatar.secure_url,
    cover: cover ? cover.secure_url : "",
  };

  const user = await User.create(userData);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", createdUser));
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  // tokenOnly can be passed as boolean in body or as query string tokenOnly=true
  const tokenOnly =
    req.body?.tokenOnly === true || String(req.query?.tokenOnly) === "true";

  if (!email && !userName) {
    throw new ApiError(400, "Email or username is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (!user) {
    throw new ApiError(404, "User not found with given email or username");
  }

  const validUser = await user.isPasswordCorrect(password);
  if (!validUser) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  // ensure user's refresh token is persisted
  user.refreshToken = refreshToken;
  await user.save({ validationBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // If client asked for token-only (useful for cross-origin frontends), return tokens in JSON
  if (tokenOnly) {
    return res.status(200).json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
  }

  // Default behavior: set cookies
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

//auth middleware needs to be applied to this route
const resetAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access, no refresh token provided");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decoded?._id).select("-password");

  if (!user) {
    throw new ApiError(404, "Invalid token, user not found");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Unauthorized access, invalid refresh token");
  }

  const {
    accessToken,
    newRefreshToken,
    refreshToken: returnedRefresh,
  } = await generateAccessRefreshToken(user._id);

  // update user refresh token if generator didn't already persist it
  if (returnedRefresh && returnedRefresh !== user.refreshToken) {
    user.refreshToken = returnedRefresh;
    await user.save({ validationBeforeSave: false });
  }

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken || returnedRefresh || "", options)
    .json(
      new ApiResponse(200, "Access token refreshed successfully", {
        accessToken,
        refreshToken: newRefreshToken || returnedRefresh,
      })
    );
});

//auth middleware needs to be applied to this route
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

//auth middleware needs to be applied to this route
const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "Current user fetched successfully", req.user));
});

//auth middleware needs to be applied to this route
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, userName, email } = req.body;
  if ([fullName, userName, email].some((element) => element?.trim() === "")) {
    throw new ApiError(400, "All input field is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName,
      userName,
      email,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, "User profile updated successfully", user));
});

//To do by myself : delete previous avatar and cover image from cloudinary
const updateUserAvatar = asyncHandler(async (req, res) => {
  // const avatarLocal = req.file ? req.file.path : null;
  const avatarFile = req.file ? req.file : null;
  const previousAvatar = req.user.avatar;
  const avatarPublicId = extractPublicIdFromUrl(previousAvatar);

  if (!avatarFile) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await cloudinaryFileUp(avatarFile);

  if (!avatar.secure_url) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  if (avatarPublicId) {
    const deletedFile = cloudinaryFileDeleteById(avatarPublicId, "image");
    if (!deletedFile) {
      console.error("Failed to delete old avatar from Cloudinary");
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar.secure_url },
    { new: true }
  ).select("-password -refreshToken");

  if (avatarPublicId) {
    const deletedFile = cloudinaryFileDeleteById(avatarPublicId, "image");
    if (!deletedFile) {
      console.error("Failed to delete old avatar from Cloudinary");
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, "User avatar updated successfully", user));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  // const coverLocal = req.file ? req.file.path : null;
  const coverFile = req.file ? req.file : null;
  const previousCover = req.user.coverImage;
  const coverPublicId = extractPublicIdFromUrl(previousCover);

  if (!coverFile) {
    throw new ApiError(400, "Cover image is required");
  }

  const cover = await cloudinaryFileUp(coverLocal);

  if (!cover.secure_url) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  if (coverPublicId) {
    const deletedFile = cloudinaryFileDeleteById(coverPublicId, "image");
    if (!deletedFile) {
      console.error(
        "Failed to delete old cover from Cloudinary or no previous cover image"
      );
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { coverImage: cover.secure_url },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, "User cover image updated successfully", user));
});

const getChannelDetails = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName || userName.trim() === "") {
    throw new ApiError(400, "Username is required");
  }

  const channel = await User.aggregate([
    {
      $match: { userName: userName?.toLowerCase() },
    },
    {
      $lookup: {
        from: "subscribers",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscribers",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedChannels",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribedChannelsCount: { $size: "$subscribedChannels" },
        isSubscribed: {
          if: { $in: [req.user?._id, "$subscribers.subscriber"] },
          then: true,
          else: false,
        },
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        subscribers: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);

  if (!channel || channel.length === 0) {
    throw new ApiError(404, "Channel not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Channel details fetched successfully", channel[0])
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
  ]);
});

//export the functions
module.exports = {
  userRegister,
  userLogin,
  userLogout,
  resetAccessToken,
  changePassword,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  updateUserCoverImage,
  resetAccessToken,
  getChannelDetails,
  getWatchHistory,
};
