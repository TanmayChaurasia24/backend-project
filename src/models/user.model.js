// Importing required modules
import mongoose, { Schema } from "mongoose"; // Importing mongoose for MongoDB interaction and Schema for defining data schema
import bcrypt from 'bcryptjs'; // Importing bcryptjs for password hashing
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for generating JWT tokens

// Defining the user schema
const userschema = new Schema({
    // Username field
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    // Email field
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    // Full name field
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    // Avatar field
    avatar: {
        type: String,
        required: true,
    },
    // Watch history field (array of Video references)
    watchhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    // Password field
    password: {
        type: String,
        required: [true, "password is required"]
    },
    // Refresh token field
    refreshtoken: {
        type: String
    }
}, { timestamps: true }); // Adding timestamps to automatically manage createdAt and updatedAt fields

// Middleware to hash the password before saving the user document
userschema.pre("save", async function(next) {
    // Check if password is modified before hashing
    if (!this.isModified("password")) return next();
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10); // Hashing password using bcrypt with salt factor 10
    next();
});

// Method to check if the entered password is correct
userschema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password); // Comparing entered password with hashed password
}

// Method to generate access token for the user
// userschema: This likely refers to a schema defined using Mongoose, which is a popular Node.js library for MongoDB object modeling. In Mongoose, schemas define the structure of documents within a collection in MongoDB.

// .methods.generateAccessToken: This part is defining a method named generateAccessToken that will be available on instances of the userschema model. The methods property in Mongoose allows you to define custom instance methods for documents created based on this schema.
userschema.methods.generateAccessToken = async function() {
    // Generating JWT token with user details and expiration time .sign method is the method to make JWT token which takes token secret and expiry time 
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET, // Using environment variable for access token secret
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Setting expiration time for access token
        }
    );
}

// Method to generate refresh token for the user
userschema.methods.generateRefreshToken = async function() {
    // Generating JWT token with user ID and expiration time
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, // Using environment variable for refresh token secret
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPRIRY // Setting expiration time for refresh token
        }
    );
}

// Creating User model using the user schema
export const User = mongoose.model("User", userschema);
