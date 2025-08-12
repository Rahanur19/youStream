const { asyncHandler } = require("../utils/asyncHandler");

const userRegister = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "okkkkkkkkkkkkkk",
  });
});

module.exports = { userRegister };
