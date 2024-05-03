import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from '../utils/apierror.js';
import { User } from '../models/user.model.js';
import { uploadoncloudinary } from '../utils/cloudinary.js';
import { apiresponse } from '../utils/apiresponse.js';
import jwt from  'jsonwebtoken';

// it requires user id
const generateAccessTokenAndRefreshToken = async(userID) => {
    try {
        const user = await User.findById(userID) // find the user with this user id
        const accesstoken = user.generateAccessToken()   // create a new token for the user's session this will return string representing the JWT
        const refreshtoken = user.generateRefreshToken() //  create a new refresh token, which will be used to regenerate a new access token.

        user.refreshtoken = refreshtoken // set the token
        await user.save({validateBeforeSave: false}) // we are saving the information  to the database validateBeforeState is used because if we will not use it then our database will generate error beacuse it is asking for every field defined in user model

        return {accesstoken, refreshtoken}
        

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and acess token")
    }
}

// register user function
const registeruser = asynchandler(async (req, res, next) => {
    const { fullname, email, username, password } = req.body; // destructure  the request body to get the required fields 

    // check all the fields are entered by the user or not 
    if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // check for the existing user in database,both email and username should be different for each user
    const existed_user = await User.findOne({ $or: [{ username }, { email }] }); 
    if (existed_user) {
        throw new ApiError(409, "User with this email or username already exists. Try using another email or username.");
    }

    // Check if files are uploaded and handle them
    if (!req.files || !req.files.avatar) {
        throw new ApiError(400, "Avatar and cover image are required");
    }

    const avatarLocalPath = req.files.avatar[0].path;
    // const coverImageLocalPath = req.files.coverimage?.[0].path;

    // Check if avatar and cover image are present
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar and cover image files are required");
    }

    // Upload avatar and cover image to cloudinary
    const avatar = await uploadoncloudinary(avatarLocalPath);
    // const coverImage = await uploadoncloudinary(coverImageLocalPath);

    // Check if avatar and cover image upload failed
    if (!avatar) {
        throw new ApiError(400, "Avatar and cover image upload failed");
    }

    // Create a new user in the database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        // coverimage: coverImage.url,
        email,
        password,
        username: username.toLowerCase(),
    });

    const createduser = await User.findById(user._id).select("-password -refreshtoken");
    
    if(!createduser) {
        throw new ApiError(500, "something went wrong while registering the user");
    }

    // Send a success response
    return res.status(201).json(
        new apiresponse(200, user, "User has been created")
    );
});


const loginuser = asynchandler(async (req, res) => {
    // Request body contains user data including username/email and password
    const { username, email, password } = req.body;

    // Check if username or email is provided
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Find the user by username or email in the database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    // If user does not exist, throw an error
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Check if the entered password matches the stored password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    
    // If password is incorrect, throw an error
    if (!isPasswordCorrect) {
        throw new ApiError(403, 'Invalid credentials');
    }

    // Generate access token and refresh token for the user
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    // Find the logged-in user and exclude sensitive data like password and refresh token
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Options for setting cookies
    const options = {
        httpOnly: true, // Only accessible via HTTP(S) and not by JavaScript
        secure: false,   // Cookies will only be sent over HTTPS
    };

    // Set cookies with access token and refresh token, and send response
    return res
    .status(200)
    .cookie("accesstoken", accessToken, options) // Setting access token cookie
    .cookie("refreshtoken", refreshToken, options)// Setting refresh token cookie
    .json(
        new apiresponse(
            200,
            {
                user: loggedInUser, // Sending user details in the response
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    );

});



const logoutuser = asynchandler(async (req, res) => {
    // Update the user document in the database to remove the refresh token
    await User.findByIdAndUpdate(
        req.user._id, // Find the user by their ID
        {
            $set: {
                refreshtoken: undefined // Set the refresh token field to undefined
            }
        },
        {
            new: true // Return the updated document after the update operation
        }
    );

    // Options for setting cookies
    const options = {
        httpOnly: true, // Only accessible via HTTP(S) and not by JavaScript
        secure: false    // Cookies will only be sent over HTTPS
    };

    // Clear the access token and refresh token cookies
    return res.status(200)
        .clearCookie("accesstoken", options)   // Clear the access token cookie
        .clearCookie("refreshtoken", options)  // Clear the refresh token cookie
        .json(new apiresponse(200, "User logged out successfully")); // Send a success response
});


const refreshaccesstoken = asynchandler(async (req,res) => {
    const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken

    if(!incomingrefreshtoken) {
        throw new ApiError(401, "Please authenticate first");
    }

    const decodedtoken = jwt.verify(
        incomingrefreshtoken, 
        process.env.REFRESH_TOKEN_SECRET 
    )

    const user = await User.findById(decodedtoken?._id)

    if(!user) {
        throw new ApiError(401, "invalid refresh token");
    }

    if(incomingrefreshtoken !== user?.refreshtoken) {
        throw new ApiError(401, "refresh token is expired or used")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    await generateAccessTokenAndRefreshToken(user._id)


    return res.status(200)
    .cookie('accessToken', user.accesstoken ,options)
    .cookie('refreshToken', user.refreshtoken,options)
    .json({
        status: 200,
        message:"New Access Token Generated Successfully"
    })

})
export { registeruser, loginuser, logoutuser, refreshaccesstoken };
