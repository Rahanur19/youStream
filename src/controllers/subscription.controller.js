const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const Subscription = require("../models/subscription.model.js");
const mongoose = require("mongoose");

// toggle subscription (subscribe/unsubscribe)
// get all subscriptions of a user
// get all subscribers of a channel

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });
  if (existingSubscription) {
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, "Unsubscribed successfully"));
  }
  const newSubscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });
  if (!newSubscription) {
    throw new ApiError(500, "Failed to subscribe");
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Subscribed successfully", newSubscription));
});

const getAllSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ subscriber: req.user._id })
    .populate("channel", "name email")
    .sort({ createdAt: -1 });
  if (!subscriptions) {
    throw new ApiError(404, "No subscriptions found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Subscriptions fetched successfully", subscriptions)
    );
});

const getAllSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscription.find({ channel: req.user._id })
    .populate("subscriber", "name email")
    .sort({ createdAt: -1 });
  if (!subscribers) {
    throw new ApiError(404, "No subscribers found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Subscribers fetched successfully", subscribers)
    );
});

module.exports = {
  toggleSubscription,
  getAllSubscriptions,
  getAllSubscribers,
};
