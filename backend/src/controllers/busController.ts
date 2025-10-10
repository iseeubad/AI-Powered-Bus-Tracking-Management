import { Bus } from "../models/Bus";
import { Request, Response } from "express";
import mongoose from "mongoose";

// credeat a new bus

export const createBus = async (req: Request, res: Response) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json(bus);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create bus",
            error 
        });
    }
};

// get all buses

export const getAllBuses = async (req: Request, res: Response) => {
    try {
        const buses = await Bus.find();
        if (!buses.length)
            res.status(404).json({ message: "No bus fouund !!"});
        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get all buses !!",
            error: (error as Error).message
        });
    }
};

// get one bus by id

export const getBusById = async (req: Request, res: Response) => {
    const { id } = req.params ;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ message: "Invalid bus Id"});
    
    try {
        const bus = await Bus.findById(id);
        if (!bus) return res.status(404).json({ message: "Bus not found"});
        res.status(200).json(bus);
    } catch (error) {
        res.status(500).json({
            message: "error fetchign bus",
            error
        });
    }
};

// update a bus

export const updateBus = async (req: Request, res: Response) => {
    const { id }  = req.params;
    if (!mongoose.isValidObjectId(id)){
        return res.status(400).json({
            message: "Invalid bus id"
        });
    }
    console.log(req)
    try {
        const bus = await Bus.findByIdAndUpdate(id, req.body, {new:true, overwrite: true, runValidators:true});
        if (!bus) return res.status(404).json({
            message: "Bus by id not found!",
        });
        res.status(200).json(bus);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update the bus",
            error 
        });
    }
};

// delete a bus 

export const deleteBus = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
    {
        return res.status(400).json({
            messgage: "Ivalide bus id",
        });
    }
    try {
        const bus = Bus.findByIdAndDelete(id);
        if (!bus) return res.status(404).json({ message: "Bus not found"});
        res.status(200).json({ message: "Bus deleted successfully" });
    } catch (error){
        res.status(500).json({
            message: "Error deleting bus",
            error
        })
    }
}
