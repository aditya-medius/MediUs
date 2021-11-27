import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const db_path: string = <string>process.env.DB_PATH;
mongoose.connect(db_path, () => {
<<<<<<< HEAD
  console.log("Connected to database");
=======
  console.log("Connected to MongoDBdatabase");
>>>>>>> d4d783809756cbb71fc59ba3624d848dbc518965
});

module.exports = { dbConnection: mongoose }; 
