import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const db_path: string = <string>process.env.DB_PATH;
mongoose.connect(db_path, () => {
  console.log("Connected to MongoDBdatabase");
});

module.exports = { dbConnection: mongoose }; 
