// Import the mongoose library for MongoDB interactions
import mongoose from "mongoose";

// Import the DB_NAME constant from the constants.js file
import { DB_NAME } from "../constants.js";

// Define an asynchronous function named connectDB to establish a connection with the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to establish a connection with the MongoDB database using the mongoose.connect() method
        // ${process.env.mongodb_uri} is the MongoDB URI provided as an environment variable
        // DB_NAME is the name of the MongoDB database
        const connectionInstance = await mongoose.connect(`${process.env.mongodb_uri}/${DB_NAME}`);

        // If the connection is successful, log a success message to the console
        console.log(`\nMongoDB connected!! DB host: ${connectionInstance.connection.host}`);
    } catch (error) {
        // If an error occurs during the connection attempt, log the error to the console
        console.log("Mongo connection error: ", error);

        // Terminate the Node.js process with an exit code of 1 (indicating an error)
        process.exit(1); // We can use throw error also
    }
};

// Export the connectDB function as the default export of this module
export default connectDB;
