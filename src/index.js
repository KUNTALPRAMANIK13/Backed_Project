import dotenv from "dotenv";
import { connectDb } from "./db/index.js";
import { mongoose } from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";

dotenv.config({
  path: "./.env",
});
connectDb();









// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.Mongo_Uri}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error while connecting to the database");
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// })();
