const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryFileUp = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) return reject("No file provided");

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "youstream" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); // result.secure_url contains the Cloudinary URL
      }
    );

    // Convert buffer to readable stream and pipe to Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

module.exports = cloudinaryFileUp;
