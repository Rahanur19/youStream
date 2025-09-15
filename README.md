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
