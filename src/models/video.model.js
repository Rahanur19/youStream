const mongoose = require("mongoose");

const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, // cloudinary URL for the video file
      required: true,
    },

    thumbnail: {
      type: String, // cloudinary URL for the thumbnail image
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title must not exceed 100 characters"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Description must not exceed 500 characters"],
    },

    duration: {
      type: Number, // cloudinary duration in seconds
      required: true,
    },

    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Video", videoSchema);
