// require('dotenv').config({path:'./env'}) not use this we have improved version for it 

// Import the dotenv library to load environment variables from a .env file
import dotenv from "dotenv";

// Import the connectDB function from the ./db/index.js file
import connectDB from "./db/index.js";

// Load environment variables from a .env file into process.env
dotenv.config({
    path: './env'
});

// Call the connectDB function to establish a connection with the MongoDB database
// This function returns a Promise
connectDB()
    .then(() => {
        // If the connection is successful, start the server and listen for incoming requests
        // The server listens on the port specified in the environment variable PORT, or port 8000 if PORT is not defined
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on port : ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        // If an error occurs during the database connection attempt, log the error to the console
        console.log("MongoDB connection failed!!", error);
    });











/*

first approach to connect to database
import express from "express"
const app = express()

// database connection
;(async ()=> {
    try {
       await mongoose.connect(`${process.env.mongodb_uri}/${DB_NAME}`)       
       app.on("error",(error)=>{
            console.log("uable to connect to database error is: ", error);
            throw error
       })

       app.listen(process.env.PORT, ()=> {
            console.log(`app is listing on PORT ${process.env.PORT}`);
       })
    } catch (error) {
        console.log(error);
        throw error
    }
})()

*/


