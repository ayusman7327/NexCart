import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.apiSecret,
});

const postStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecomm_product_images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});


const uploadPost = multer({
    storage: postStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
});


export { uploadPost };
