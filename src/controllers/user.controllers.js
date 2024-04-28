// Import necessary modules and utilities
import { asynchandler } from "../utils/asynchandler.js"; // Import async handler utility
import { ApiError } from '../utils/apierror.js'; // Import custom API error class
import { User } from '../models/user.model.js'; // Import User model
import { uploadoncloudinary } from '../utils/cloudinary.js'; // Import cloudinary upload utility
import { apiresponse } from '../utils/apiresponse.js'; // Import API response utility

// Define an asynchronous function to handle user registration
const registeruser = asynchandler(async (req, res) => {
    // Extract user details from the request body
    const { fullname, email, username, password } = req.body;

    // Check if any of the required fields are empty
    // .some checks the whole array and if any  element is true it returns true else false if field is empty then it will go to the if condition
    if (
        [fullname, email, username, password].some((field) => {
            return field?.trim() === "";
        })
    ) {
        // Throw an API error if any required field is empty
        throw new ApiError(400, "All fields are required");
    }

    // Check if a user with the same email or username already exists
    const existed_user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existed_user) {
        // Throw an API error if user already exists
        throw new ApiError(409, "User with this email or username already exists. Try using another email or username.");
    }

    // Get local paths for avatar and cover image from request files
    const coverimagelocalpath = req.files?.coverimage[0]?.path;
    const avatarlocalpath = req.files?.avatar[0]?.path;

    // Check if avatar is provided
    if (!avatarlocalpath) {
        // Throw an API error if avatar is required but not provided
        throw new ApiError(400, "Avatar is required");
    }

    // Upload avatar and cover image to cloudinary
    const avatar = await uploadoncloudinary(avatarlocalpath);
    const coverimage = await uploadoncloudinary(coverimagelocalpath);

    // Check if avatar is successfully uploaded
    if (!avatar) {
        // Throw an API error if avatar upload fails
        throw new ApiError(400, "Avatar file is required");
    }

    // Create a new user in the database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "", // Use cover image URL if available, otherwise use an empty string
        email,
        password,
        username: username.toLowerCase(), // Convert username to lowercase
    });

    // Retrieve the created user from the database and send a success response
    await User.findById(user._id)
        .then((user) => {
            // Send a JSON response with user details and success message
            return res.status(201).json(
                new apiresponse(200, user, "User has been created")
            );
        })
        .catch((err) => next(new ApiError(500, 'Server Error', err))); // Handle error if user retrieval fails
});

// Export the registeruser function to be used by other modules
export { registeruser };
