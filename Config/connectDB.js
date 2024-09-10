import mongoose  from "mongoose";

import dotenv from "dotenv";
dotenv.config();
const URI= process.env.MGS_URI

const ConnectDB= async()=>{
    try {
        const DB=  await mongoose.connect(URI)
        console.log("connect Database successfully")  
    }
    catch (error) {
        console.log("Error Connecting to database \n",error)
        throw new Error(error.message)
    }}
export default ConnectDB
