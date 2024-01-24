import { mongoose } from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.Mongo_Uri}/${DB_NAME}`
    );
    console.log(
      `\n MongoDb Connected !! DB Host:${connectionInstance.connection.host} `
    );
  } catch (error) {
    console.log("MongoDb Connection Failed", error);
    process.exit(1);
  }
};
