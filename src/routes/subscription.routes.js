const express = require("express");
const Router = express.Router();

// Importing middlewares
const { verifyJWT } = require("../middlewares/auth.middleware.js");

// Importing subscription controller functions
const {
  toggleSubscription,
  getAllSubscriptions,
  getAllSubscribers,
} = require("../controllers/subscription.controller.js");

// Subscription routes
Router.post("/toggle-subscription/:channelId", verifyJWT, toggleSubscription);
Router.get("/all-subscriptions", verifyJWT, getAllSubscriptions);
Router.get("/all-subscribers", verifyJWT, getAllSubscribers);

module.exports = Router;
