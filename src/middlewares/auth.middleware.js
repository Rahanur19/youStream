const { ApiError } = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { asyncHandler } = require("../utils/asyncHandler.js");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access, no token provided");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "Invalid token, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Unauthorized access, invalid token"
    );
  }
});

module.exports = { verifyJWT };
