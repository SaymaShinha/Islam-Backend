import "../config/env.js";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const getUpload = () => {
  console.log("UPLOAD ENV:");
  console.log(process.env.CLOUDINARY_API_KEY);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,

    params: async (req, file) => ({
      folder: "products",

      allowed_formats: ["jpg", "jpeg", "png", "webp", "jfif"],
    }),
  });

  return multer({ storage });
};

export default getUpload;
