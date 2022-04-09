import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const db_path: string = <string>process.env.DB_PATH;

const Conn = mongoose.createConnection();

let connection;
(async () => {
  mongoose.connect(db_path, async () => {
    console.log("Connected to MongoDBdatabase");
  });
  const Conn = mongoose.createConnection();

  // connect to database
  await Conn.openUri(<string>process.env.DB_PATH);
  // Conn.collection("special").find();
  module.exports = Conn;
})();

// export connection;

// connect to database
// Conn.collection("special").find();
