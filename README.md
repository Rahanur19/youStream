# youStream

A professional video streaming platform built with Node.js, Express, and MongoDB. Features user authentication, video uploads, and secure access management.

## Features

- User registration and login (JWT-based authentication)
- Video upload and streaming
- Secure file handling with Multer and Cloudinary
- RESTful API structure
- Error handling and response utilities

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (file uploads)
- Cloudinary (media storage)
- JWT (authentication)

## Project Structure

```
src/
	app.js                # Main Express app
	constants.js          # App constants
	index.js              # Entry point
	controllers/
		user.controller.js  # User logic
	db/
		index.js            # DB connection
	middlewares/
		auth.middleware.js      # Auth checks
		multer.middleware.js    # File uploads
	models/
		user.model.js       # User schema
		video.model.js      # Video schema
	routes/
		user.routes.js      # User routes
	utils/
		ApiError.js
		ApiResponse.js
		asyncHandler.js
		cloudinaryFileUp.js
		generateAccessRefreshToken.js
public/
	temp/                 # Temporary files
```

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB instance
- Cloudinary account (for media storage)

### Installation

```bash
git clone https://github.com/Rahanur19/youStream.git
cd youStream
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the App

```bash
npm start
```

The server will run on `http://localhost:5000` (or your specified port).

## API Endpoints

### Auth

- `POST /api/v1/users/register` — Register a new user
- `POST /api/v1/users/login` — Login and get JWT

### Videos

- `POST /api/v1/videos/upload` — Upload a video (authenticated)
- `GET /api/v1/videos/:id` — Stream a video

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

# youStream

A backend project for video uploading and user profiles, built with Node.js, Express, and MongoDB. Supports user authentication, video management, likes, and community posts.

## Features

- User registration, login, logout, password change, and profile management
- Video upload, update, retrieval, and deletion
- Like system for videos, comments, and community posts
- Community post creation and management
- JWT-based authentication and secure file uploads (Multer + Cloudinary)
- RESTful API structure with error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (file uploads)
- Cloudinary (media storage)
- JWT (authentication)
- CORS, Cookie-Parser

## Project Structure

```
src/
	app.js
	constants.js
	index.js
	controllers/
		user.controller.js
		video.controller.js
		like.controller.js
		communityPost.controller.js
	db/
		index.js
	middlewares/
		auth.middleware.js
		multer.middleware.js
	models/
		user.model.js
		video.model.js
		like.model.js
		comment.model.js
		playlist.model.js
		subscription.model.js
		communityPost.model.js
	routes/
		user.routes.js
		video.routes.js
		like.routes.js
		communityPost.routes.js
	utils/
		ApiError.js
		ApiResponse.js
		asyncHandler.js
		cloudinaryFileUp.js
		cloudinaryFileDeleteById.js
		generateAccessRefreshToken.js
public/
	temp/
package.json
```

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB instance
- Cloudinary account

### Installation

```bash
git clone https://github.com/Rahanur19/youStream.git
cd youStream
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=your_frontend_url
```

### Running the App

```bash
npm run dev
```

## API Endpoints

### User

- `POST /api/v1/users/register` — Register a new user (with avatar/cover image)
- `POST /api/v1/users/login` — Login
- `POST /api/v1/users/logout` — Logout (JWT required)
- `POST /api/v1/users/refresh-token` — Refresh JWT
- `POST /api/v1/users/change-password` — Change password (JWT required)
- `GET /api/v1/users/current-user` — Get current user info (JWT required)
- `PATCH /api/v1/users/update-profile` — Update profile (JWT required)
- `PATCH /api/v1/users/update-avatar` — Update avatar (JWT required)
- `GET /api/v1/users/channel/:userId` — Get channel details
- `GET /api/v1/users/watch-history` — Get watch history

### Video

- `GET /api/v1/videos/all-videos` — Get all videos (JWT required)
- `GET /api/v1/videos/:videoId` — Get video by ID (JWT required)
- `POST /api/v1/videos/upload-video` — Upload video (JWT required, Multer)
- `PUT /api/v1/videos/update-video/:videoId` — Update video (JWT required, Multer)
- `DELETE /api/v1/videos/delete-video/:videoId` — Delete video (JWT required)
- `PATCH /api/v1/videos/toggle-publish/:videoId` — Toggle publish status (JWT required)

### Like

- `POST /api/v1/likes/video/:videoId` — Like/unlike a video (JWT required)
- `POST /api/v1/likes/comment/:commentId` — Like/unlike a comment (JWT required)
- `POST /api/v1/likes/community-post/:communityPostId` — Like/unlike a community post (JWT required)
- `GET /api/v1/likes/video/:videoId` — Get video like count (JWT required)
- `GET /api/v1/likes/comment/:commentId` — Get comment like count (JWT required)
- `GET /api/v1/likes/community-post/:communityPostId` — Get community post like count (JWT required)
- `GET /api/v1/likes/liked-videos` — Get all liked videos by user (JWT required)

### Community Post

- `POST /api/v1/community-posts/create-post` — Create post (JWT required)
- `GET /api/v1/community-posts/all-posts` — Get all posts (JWT required)
- `GET /api/v1/community-posts/post/:postId` — Get post by ID (JWT required)
- `PUT /api/v1/community-posts/update-post/:postId` — Update post (JWT required)

# youStream — API Backend

youStream is a backend API for a video-sharing platform. It provides user management, video uploads (Multer + Cloudinary), likes, comments, playlists, subscriptions, and community posts. The API is built with Node.js, Express and MongoDB (Mongoose).

This README documents how to set up, run and maintain the project, and where to find the API documentation (Swagger/OpenAPI).

## Quick links

- API docs (Swagger UI): /api/docs
- Raw OpenAPI JSON: /api/docs.json
- Exported OpenAPI file: `public/openapi.json` (generated by `node scripts/export-swagger.js`)

## Features

- User authentication (JWT): register, login, logout, refresh token, change password
- Video management: upload, update, delete, list, toggle publish
- Likes for videos, comments and community posts
- Comments and threaded operations
- Playlists and playlist management
- Subscriptions (follow/unfollow channels)
- Community posts
- File uploads handled by Multer and stored on Cloudinary
- API documentation generated and served via Swagger UI

## Tech stack

- Node.js (v20+)
- Express 5
- MongoDB + Mongoose
- Multer (file uploads)
- Cloudinary (media storage)
- JWT (authentication)
- Swagger (swagger-jsdoc + swagger-ui-express)

## Project structure

```
src/
  app.js                    # Express application and middleware
  index.js                  # Server entry (connects DB and starts server)
  constants.js              # App-level constants
  controllers/              # Controllers for each resource
  db/                       # DB connection
  middlewares/              # Express middlewares (auth, multer, etc.)
  models/                   # Mongoose models
  routes/                   # Express routers
  swagger.js                # Swagger/OpenAPI merge + config
  docs/                     # OpenAPI YAML fragments (merged at runtime)
scripts/
  export-swagger.js         # Export merged OpenAPI JSON to public/openapi.json
public/
  openapi.json              # Generated OpenAPI JSON (committed/generated)
  temp/
utils/
  ApiError.js
  ApiResponse.js
  asyncHandler.js
  cloudinaryFileUp.js
  generateAccessRefreshToken.js
package.json
README.md
```

## Getting started

Prerequisites

- Node.js v20 or later
- A running MongoDB instance (local or Atlas)
- Cloudinary account for media uploads (optional for local testing)

Install

Windows (cmd.exe / PowerShell):

```bash
git clone https://github.com/Rahanur19/youStream.git
cd youStream
npm install
```

Environment

Create a `.env` file in the project root. Minimal example:

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/youstream
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000
```

Notes:

- If `PORT` is not set the app will use the value in your environment or fallback used in `src/index.js`.

Run

Start in development (nodemon):

```bash
npm run dev
```

Export API docs (writes `public/openapi.json`):

```bash
npm run docs:export
```

The app serves interactive API docs at `/api/docs` (Swagger UI) and the raw OpenAPI JSON at `/api/docs.json`.

## Notable npm scripts

- `npm run dev` — start server with nodemon (development)
- `npm run docs:export` — run `scripts/export-swagger.js` to write merged OpenAPI JSON to `public/openapi.json`

## Installed packages (high level)

Key runtime dependencies used for docs and runtime:

- `swagger-jsdoc`, `swagger-ui-express` — Swagger UI and spec generation
- `js-yaml`, `glob` — load and merge YAML docs at runtime

Other important runtime packages include `express`, `mongoose`, `multer`, `cloudinary`, `jsonwebtoken`, and `bcrypt`.

## API overview

This project uses a versioned REST API under `/api/v1/` with the following resource groups (not exhaustive):

- Users: register, login, logout, refresh-token, change-password, current-user, update-profile, update-avatar, update-cover-image, channel, watch-history
- Videos: upload-video, all-videos, get by id, update-video, delete-video, toggle-publish
- Comments: create-comment, delete-comment, all-comments, update-comment, get comment
- Playlists: create-playlist, all-playlists, playlist/:id, add/remove video, update, delete
- Likes: toggle/get like counts for videos/comments/community-posts, get liked videos
- Subscriptions: toggle-subscription, all-subscriptions, all-subscribers
- Community posts: create-post, all-posts, post/:id, update-post, delete-post

For full, up-to-date API documentation use the built-in Swagger UI at `/api/docs` (it merges YAML files from `src/docs/`). If you need a static copy, run `npm run docs:export` to produce `public/openapi.json`.

## Error handling and standard responses

- The project exposes consistent error shapes via `ApiError` and success envelopes like `SuccessResponse`. The OpenAPI `components` contain those schemas and resource schemas (User, Video, Comment, Playlist, CommunityPost).

## Recommendations & next steps

- Add a CI workflow (GitHub Actions) that runs `npm run docs:export` and validates the generated OpenAPI JSON (e.g. using `swagger-cli` or `openapi-cli`) to keep docs in sync.
- Add more detailed examples and `required` fields in `src/docs/components.yaml` for richer generated docs.
- Add automated tests for critical routes (auth, uploads, video CRUD).

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Run tests and lint (add tests if you change behavior)
4. Commit and open a Pull Request

Please follow existing code style and keep API backwards compatibility in mind.

## Troubleshooting

- If Swagger UI doesn't show changes, run `npm run docs:export` and reload `/api/docs`.
- If uploads fail, ensure your Cloudinary creds are set in `.env` and network access to Cloudinary is available.
- Check `src/index.js` logs for DB connection errors.

## License

This project is licensed under the ISC License.
