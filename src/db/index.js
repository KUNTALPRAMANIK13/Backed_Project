import { mongoose } from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDb = async () => {
    try {
        // const mongoUri = process.env.Mongo_Uri;

        // // Assuming DB_NAME contains the name of the specific database
        // const encodedDBName = encodeURIComponent(DB_NAME);

        // const connectionInstance = await mongoose.connect(`${mongoUri}/${encodedDBName}`, {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        // });

        const connectionInstance = await mongoose.connect(
            process.env.Mongo_Uri,
            {
                dbName: DB_NAME,
            }
        );

        console.log(
            `MongoDb Connected !! DB Host:${connectionInstance.connection.host} `
        );
    } catch (error) {
        console.log("MongoDb Connection Failed", error);
        process.exit(1);
    }
};
