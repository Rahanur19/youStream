const cloudinary = require("cloudinary").v2;

// Configure Cloudinary (you can remove this if already configured globally)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Deletes a file from Cloudinary using its public_id
 * @param {string} publicId - The public_id of the file (no extension)
 * @param {string} resourceType - 'auto' by default (can be 'image', 'video', 'raw')
 * @returns {Promise<Object|null>}
 */
const cloudinaryFileDeleteById = async (publicId, resourceType = "auto") => {
  try {
    if (!publicId) throw new Error("No public_id provided");

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return null;
  }
};

module.exports = cloudinaryFileDeleteById;
