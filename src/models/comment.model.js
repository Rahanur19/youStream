const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Comment must be at least 1 character long"],
      maxlength: [300, "Comment must not exceed 300 characters"],
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      // required: true,
    },
    communityPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      // required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Comment", commentSchema);
