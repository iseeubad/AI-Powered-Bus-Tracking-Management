import { Router } from "express";
import {
    getAllBuses,
    createBus,
    getBusById,
    updateBus,
    deleteBus, 
} from "../controllers/busController";
import { sendBusDataToAI } from "../controllers/busDataPost"


const router = Router();

// CRUD routes (create, read, update, delete)
router.get("/", getAllBuses);
router.post("/", createBus);
router.get("/:id", getBusById);
router.put("/:id", updateBus);
router.delete("/:id", deleteBus);
router.post("/buses-data", sendBusDataToAI);

export default router;
