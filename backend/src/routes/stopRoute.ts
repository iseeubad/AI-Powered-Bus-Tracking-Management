import { Router } from "express";
import {
    getAllStops,
    getStopById,
    createPost,
    updateStop,
    deleteStop
} from "../controllers/stopController";


const router = Router();

router.get('/', getAllStops);
router.get('/:id', getStopById);
router.post('/:id', createPost);
router.put('/:id', updateStop);
router.delete('/:id', deleteStop);

export default router;