const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const cloudinaryFileUp = require("../utils/cloudinaryFileUp.js");
const {
  generateAccessRefreshToken,
} = require("../utils/generateAccessRefreshToken.js");

const userRegister = asyncHandler(async (req, res) => {
  //take the data from user
  //validate if the any of them blank or not
  //check if the user is already existed or not with that email or username
  //check if the avatar empty or not
  //save file in local using multer
  //upload files in cloud
  //get return value of uploaded files
  //check there - avatar info presented or not
  //final modification of user data
  //create user
  //get that user using _id
  //final - api response

  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some(
      (element) => element?.trim === ""
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

  const avatarLocal = req.files.avatar ? req.files.avatar[0].path : null;
  const coverLocal = req.files.coverImage ? req.files.coverImage[0].path : null;

  if (!avatarLocal) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await cloudinaryFileUp(avatarLocal);
  const cover = coverLocal ? await cloudinaryFileUp(coverLocal) : null;

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const userData = {
    fullName,
    userName,
    email,
    password,
    avatar: avatar.url,
    cover: cover ? cover.url : "",
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

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

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

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

//export the functions
module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
