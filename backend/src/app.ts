import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import busRoutes from "./routes/busRoute.ts";
import stopRoutes from "./routes/stopRoute.ts";
import trackRoutes from "./routes/trackRoute.ts";

import { connectDB } from "./config/db.ts";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/buses", busRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/tracks", trackRoutes);

app.listen(PORT, () => {
    console.log(" Server is running on port " + PORT);
    connectDB();
});

export default app;
