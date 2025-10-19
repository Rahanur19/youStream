const { ApiError } = require("./ApiError");
const User = require("../models/user.model.js");

const generateAccessRefreshToken = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validationBeforeSave: false });

    // return both names for compatibility: callers expect either 'refreshToken' or 'newRefreshToken'
    return { accessToken, refreshToken, newRefreshToken: refreshToken };
  } catch (error) {
    throw new ApiError(
      501,
      "Something went wrong while generating referesh and access token"
    );
  }
};

module.exports = { generateAccessRefreshToken };
