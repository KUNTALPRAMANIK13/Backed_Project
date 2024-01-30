import dotenv from "dotenv";
import { connectDb } from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error while connecting to the database");
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("MongoDb Connection Failed", error);
  });

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
