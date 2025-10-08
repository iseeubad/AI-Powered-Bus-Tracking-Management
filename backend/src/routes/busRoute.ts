import { Router } from "express";
import {
    createBus,
    getBusById,
    updateBus,
    deleteBus, 
} from "../controllers/busController";

const router = Router();

// CRUD routes (create, read, update, delete)
router.post("/", createBus);
router.get("/:id", getBusById);
router.put("/:id", updateBus);
router.delete("/:id", deleteBus);

export default router;
