import { Request, Response } from "express";
import { Bus } from "../models/Bus";


// create a new bus

export const createBus = async (req: Request, res: Response) => {
    try{
        const bus = new Bus(req.body);
        await bus.save(); // save it to db
        res.status(200).json(bus);
    } catch (error){
        res.status(400).json({ message: "Failed to create bus", error});
    }
};

// get all buses

export const getAllBuses = async (req: Request, res: Response) => {
    try {
        const buses = await Bus.find()
        res.json(buses);
    } catch (error){
        res.status(400).json({ message : "Error fetching buses", error});
    }
};

// get one bus by ID

export const getBusById = async (req: Request, res: Response) => {
    try{
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ message: "Bus not found" });
        res.json(bus);
    } catch (error){
        res.status(500).json({ message: "Error fetching bus", error});
    }
};

// update a bus

export const updateBus = async (req: Request, res: Response) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bus) return res.status(404).json({ message: "Bus not found" });
        res.json(bus);
    } catch (error){
        res.status(400).json({ message: "Error updating bus.", error});
    }
};

// delete a bus 

export const deleteBus = async (req = Request, res: Response) => {
    try {
        const bus = Bus.findByIdAndDelete(req.params.id);
        if (!bus) return res.status(404).json({ message: "Bus not found" });
        res.json(bus);
    } catch (error){
        res.status(500).json({ message: "Error deleting bus", error });
    }
};