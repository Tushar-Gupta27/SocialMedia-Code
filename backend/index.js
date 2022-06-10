import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
//ROUTES
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//ROUTES CONNECTION
//POSTS
app.use("/posts", postRoutes);
//USERS
app.use("/user", userRoutes);

//Connection of MONGODB

const MONGO_CONNECTION_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(`MongoError`);
    console.log(e.message);
  });
