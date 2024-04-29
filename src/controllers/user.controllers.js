import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from '../utils/apierror.js';
import { User } from '../models/user.model.js';
import { uploadoncloudinary } from '../utils/cloudinary.js';
import { apiresponse } from '../utils/apiresponse.js';

const registeruser = asynchandler(async (req, res, next) => {
    const { fullname, email, username, password } = req.body;

    if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existed_user = await User.findOne({ $or: [{ username }, { email }] });
    if (existed_user) {
        throw new ApiError(409, "User with this email or username already exists. Try using another email or username.");
    }

    // Check if files are uploaded and handle them
    if (!req.files || !req.files.avatar || !req.files.coverimage) {
        throw new ApiError(400, "Avatar and cover image are required");
    }

    const avatarLocalPath = req.files.avatar[0].path;
    const coverImageLocalPath = req.files.coverimage[0].path;

    // Check if avatar and cover image are present
    if (!avatarLocalPath || !coverImageLocalPath) {
        throw new ApiError(400, "Avatar and cover image files are required");
    }

    // Upload avatar and cover image to cloudinary
    const avatar = await uploadoncloudinary(avatarLocalPath);
    const coverImage = await uploadoncloudinary(coverImageLocalPath);

    // Check if avatar and cover image upload failed
    if (!avatar || !coverImage) {
        throw new ApiError(400, "Avatar and cover image upload failed");
    }

    // Create a new user in the database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Send a success response
    return res.status(201).json(
        new apiresponse(200, user, "User has been created")
    );
});

export { registeruser };
