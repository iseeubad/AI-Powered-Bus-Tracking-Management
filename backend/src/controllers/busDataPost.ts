import axios from "axios"
import { Bus } from "../models/Bus.ts" 
import { Request, Response } from "express";

export const sendBusDataToAI = async (req: Request, res: Response) => {
    try {
        const buses = await Bus.find({}, {_id: 0, __v: 0});
        
        if (!buses.length){
            res.status(404).json({
                message: "no bus found",
            });
            console.error("no bus found in the DB");
        }

        const response = await axios.post("http://localhost:5000/api/ingest", {
            buses: buses,
            count: buses.length,
            timestamp: new Date()
        });
        console.log(`All buses ${buses.length}, sent to ai service`);
        res.status(200).json({
            success: true,
            count: buses.length,
            message: `all ${buses.length} sent to the ai`,
            aiResponse: response.data,
        })
    } catch (error){
        res.status(400).json({
            success: false,
            message: "failed to send bus data",
            error
        })
        console.error("error sending buses data");
    }
};
