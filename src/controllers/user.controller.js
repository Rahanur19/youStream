const User = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const cloudinaryFileUp = require("../utils/cloudinaryFileUp.js");

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

module.exports = { userRegister };
