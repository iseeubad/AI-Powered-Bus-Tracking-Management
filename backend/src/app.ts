import express from "express";
import cors from "cors";
import busRoutes from "./routes/busRoute.ts";
import stopRoutes from "./routes/stopRoute.ts";
import trackRoutes from "./routes/trackRoute.ts";

const app = express();

app.use(cors());
app.use(experss.json());

app.use("/api/buses", busRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/tracks", trackRoutes);

export default app;
