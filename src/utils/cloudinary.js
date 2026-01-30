const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlkvqsrpb',
  api_key: process.env.CLOUDINARY_API_KEY || '798357358389163',
  api_secret: process.env.CLOUDINARY_API_SECRET || '74abzXspDDl0j3BDXPhPJX6anZk',
});

/**
 * Uploads an image to Cloudinary (base64 data URL from frontend). Returns { secure_url }.
 */
async function uploadToCloudinary(fileStr, folder = 'imperial') {
  const options = { folder };
  return cloudinary.uploader.upload(fileStr, options);
}

/**
 * Optionally removes an image from Cloudinary
 */
async function deleteFromCloudinary(public_id) {
  return cloudinary.uploader.destroy(public_id);
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };
