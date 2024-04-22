// require('dotenv').config({path:'./env'}) not use this we have improved version for it 

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})



connectDB()











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


