import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// import routes
import busRoute from "./routes/busRoute";
import stopRoute from "./routes/stopRoute";
import trackRoute from "./routes/trackRoute";

dotenv.config();

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/buses", busRoute);
app.use("/api/stops", stopRoute);
app.use("/api/tracks", trackRoute);

app.get("/", (req, res) => {
    res.send("Bus Tracking Management BTM project api is running...");
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB !!", err));


export default app;