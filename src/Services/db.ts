import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const db_path: string = <string>process.env.DB_PATH;
// mongoose.connect(db_path, async () => {
//   console.log("Connected to MongoDBdatabase");
//   console.log(await mongoose.connection.collection("special").aggregate());
//   // (async () => {
//   //   console.log(
//   //     "Cossss:",
//   //   );
//   // })();
// });

let connection;
(async () => {
  mongoose.connect(db_path, async () => {
    console.log("Connected to MongoDBdatabase");
  });
  const Conn = mongoose.createConnection();

  // connect to database
  await Conn.openUri(<string>process.env.DB_PATH);
})();

module.exports = { dbConnection: mongoose };
