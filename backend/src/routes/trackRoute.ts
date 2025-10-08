import { Router } from "express";
import {
    createTrack,
    getAllTracksByBus,
    getLatestTrack,
    getTrackNearBy
} from "../controllers/trackController";

const router = Router();

router.post('/', createTrack);
router.get('/:id', getAllTracksByBus);
router.get('/:id', getLatestTrack);
router.get('/:id', getTrackNearBy);

export default router;