const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(cookieParser({}));
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ extended: true, limit: "24kb" }));
app.use(express.static("public"));

//import routes
const userRoutes = require("./routes/user.routes.js");
const videoRoutes = require("./routes/video.routes.js");
const likeRoutes = require("./routes/like.routes.js");
const communityPostRoutes = require("./routes/communityPost.routes.js");
const playlistRoutes = require("./routes/playlist.routes.js");
const subscriptionRoutes = require("./routes/subscription.routes.js");

//routes
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/community-posts", communityPostRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);

module.exports = { app };
