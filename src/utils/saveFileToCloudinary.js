import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

export const saveFileToCloudinary = async (file) => {
    const result = await cloudinary.v2.uploader.upload(file.path);
    await fs.unlink(file.path);
    return result.secure_url;
};
