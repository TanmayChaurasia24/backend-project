// Imports: The code imports necessary modules and utilities. ApiError is likely a custom error class used for handling API errors, asynchandler is a utility function for handling asynchronous functions, jwt is used for working with JSON Web Tokens, and User is imported from a user model.

// verifyJWT Function: This is a middleware function named verifyJWT responsible for verifying the JSON Web Token sent with the request.

// Token Retrieval: The code attempts to retrieve the JWT from the request. It checks if the token is present in the cookies (req.cookies?.accesstoken) or in the Authorization header as a Bearer token (req.header("Authorization")?.replace("Bearer","")).

// Token Validation: If no token is found, it throws an ApiError with a status code of 401 (Unauthorized).

// Decoding Token: The JWT is decoded using jwt.verify(). This verifies the signature and decodes the token payload.

// User Retrieval: It then retrieves the user associated with the decoded token's _id from the database. The select("-password -refreshToken") statement excludes sensitive fields (password and refreshToken) from the user document.

// User Validation: If no user is found, it throws an ApiError with a status code of 401 (Unauthorized).

// Request Object Modification: If the token and user are valid, the user object is attached to the request (req.user) for further processing by subsequent middleware or route handlers.

// Next Function: Finally, the next() function is called to pass control to the next middleware or route handler in the request-response cycle.

// Error Handling: Any errors that occur during token verification or user retrieval result in throwing an ApiError with a status code of 401 (Unauthorized).

import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from '../utils/apierror.js';
import { User } from '../models/user.model.js';

export const verifyJWT = asynchandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accesstoken || (req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null);

        // Check if token exists
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user corresponding to token
        const user = await User.findById(decodedToken._id).select("-password -refreshtoken");

        // Check if user exists
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        // Assign user to request object
        req.user = user;
        next();
    } catch (error) {
        // Handle errors
        throw new ApiError(401, "Invalid access token");
    }
});



