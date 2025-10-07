import { Router } from "express";
import { getAllBuses, createBus } from "../controllers/busController.ts";

const router = Router();

router.get('/', getAllBuses);
router.post('/', createBus);

export default router;
