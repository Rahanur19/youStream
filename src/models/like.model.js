const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      //   required: true,
    },

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      //   required: true,
    },

    communityPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      //   required: true,
    },

    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Like", likeSchema);
