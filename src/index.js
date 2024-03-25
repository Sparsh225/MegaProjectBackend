import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/index.js";
import { app } from "./app.js";
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server at running at ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log("Mongo Db connection failed !!!", error));

/*
const app = express();
(async () => {
  try {
    mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("error :", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server Started at Port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error ", error);
    throw error;
  }
})();
*/
