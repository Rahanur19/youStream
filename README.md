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
- `DELETE /api/v1/community-posts/delete-post/:postId` — Delete post (JWT required)

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
