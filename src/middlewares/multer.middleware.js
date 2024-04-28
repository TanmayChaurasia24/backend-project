// Importing the multer library for handling file uploads
import multer, { memoryStorage } from "multer";

// Configuring multer disk storage for storing uploaded files
const storage = multer.diskStorage({
    // Setting the destination directory where uploaded files will be stored
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Destination directory path
    },
    // Setting the filename for the uploaded file
    filename: function (req, file, cb) {
        // Using the original filename of the uploaded file
        cb(null, file.originalname); // Original filename is used as the file's name
    }
});

// Creating a multer upload middleware with the configured storage settings
export const upload = multer({ storage: storage });
 