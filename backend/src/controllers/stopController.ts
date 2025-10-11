import { Request, Response } from "express";
import { Types } from "mongoose";
import { Stop } from "../models/Stop";

// get all the stops 

export const getAllStops = async (req: Request, res: Response) => {
    try {
        const stops = await Stop.find().sort({ last_demand_update : -1 });
        if (!stops.length)
            res.status(404).json({ message: "No stop found !!"});
        res.status(200).json({
            success: true,
            count: stops.length,
            data: stops 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get all stops !!",
            error: (error as Error).message
        });
    }
};

// get by id
export const getStopById  = async (req: Request, res: Response) => {
    try{
        const stop = await Stop.findById(req.params.id);
        if (!stop) return res.status(404).json({ message: "stop not found" });
        res.status(200).json(stop);
    } catch (error){
        res.status(500).json({ message: "Error fetching stop", error });
    }
};

// creat a stop

export const createPost = async (req: Request, res: Response) => {
    const payload = req.body;

    if (
        !payload.location ||
        payload.location.type !== "Point" ||
        !Array.isArray(payload.location.coordinates) ||
        payload.location.coordinates.length !== 2
    ){
        return res.status(400).json({ message: 
            "Invalide location. expect {type: 'Point'}, {coordinates: [lat, long]}"});
    }
    try {
        const stop =  new Stop(payload);
        await stop.save();
        return res.status(201).json(stop);
    } catch (error : any){
        if (error.code == 11000){
            return res
            .status(409)
            .json({ message: "stop with the same code/name already exist", error});
        }
        return  res.status(400).json({ message: "Erro creating stop", error });
    }
};

// update stop

export const updateStop = async (req: Request, res: Response) => {
    const { id } = req.params;
    const update = req.body;

    if (!Types.ObjectId.isValid(id)){
        return res.status(400).json({ message: "Invalide stop id"});
    }

    // this is if we have the location
    if (update.location)
    {
        if (
            update.location.type !== "Point"||
            !Array.isArray(update.location.coordinates) ||
            update.location.coordinates.length !== 2 
        ){
            return res.status(400).json({
                message: "Invalid type, {type: 'Point'}, coordinates {coordinates: [lat, long]}",
            });
        }
    }
    try {
        const updated = await Stop.findByIdAndUpdate(id, update, { new: true });
        if (!updated) return res.status(404).json({
            message: "Stop not found!",
        });
    } catch (error: any)
    {
        return res.status(500).json({ 
            message: "Error updating stop.", error
        });
    }
};


// delete a stop

export const deleteStop = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)){
        return res.status(400).json({
            message: "Invalid stop id",
        });
    }
    try {
        const removed = await Stop.findByIdAndDelete(id);
        if (!removed) return res.status(404).json({
            message: "Stop not found",
        });
    } catch (error){
        return res.status(500).json({
            message: "Error deleting stop", 
            error
        });
    }
};