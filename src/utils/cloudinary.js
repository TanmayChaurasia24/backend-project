// Importing the cloudinary v2 SDK and the fs module from Node.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuring cloudinary with the API credentials obtained from environment variables
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Defining an asynchronous function to upload a file to cloudinary
const uploadoncloudinary = async (localfilepath) => {
  try {
    // Check if local file path exists
    if (!localfilepath) {
      return null; // If not, return null
    } else {
      // If file path exists, upload the file to cloudinary
      const response = await cloudinary.uploader.upload(localfilepath, {
        resource_type: "auto" // this will automatically detect the wether it is a file,video,pdf etc
      });

      // Log success message and return cloudinary response
      // console.log("File has uploaded successfully on cloudinary: ", response.url);
      fs.unlinkSync(localfilepath)
      return response;
    }
  } catch (error) {
    // If an error occurs during upload, delete the local file and return null
    fs.unlinkSync(localfilepath); // delete the local file as error occurred while uploading the file
    return null;
  }
}

// Export the uploadoncloudinary function for use in other modules
export { uploadoncloudinary };
