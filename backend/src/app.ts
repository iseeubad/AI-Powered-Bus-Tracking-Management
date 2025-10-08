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
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Connected to mongoDB");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("MongoDB connection failed: ", err);
    });

export default app;