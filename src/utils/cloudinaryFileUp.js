const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryFileUp = async (localFilePath) => {
  try {
    if (!localFilePath) return "No file path provided";
    // upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file uploaded successfully
    console.log("file uploaded successfully : ", result.url);
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath); //delete the file from local if upload fails
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

module.exports = cloudinaryFileUp;
