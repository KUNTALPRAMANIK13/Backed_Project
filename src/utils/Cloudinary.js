import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) {
            return null;
        }
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary->", response);
        fs.unlinkSync(localfilePath); //delete local copy of the image after upload
        return response;
    } catch (error) {
        console.log("Error in uploading file to Cloudinary : ", error);
        fs.unlinkSync(localfilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

async function deleteImageFromCloudinary(oldUrl) {
    // Extract the public_id from the old URL
    const publicId = extractPublicId(oldUrl);

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return result;
}

// Extract the public_id from the Cloudinary URL
function extractPublicId(url) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = filename.split(".")[0];
    return publicId;
}

export { UploadOnCloudinary, deleteImageFromCloudinary };
