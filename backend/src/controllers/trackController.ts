import { Track } from "../models/Track";
import { Request, Response } from "express";

// create a new track

export const createTrack = async (req: Request, res: Response) => {
    try {
        const track = new Track(req.body);
        const savedTrack = await track.save();
        res.status(201).json(savedTrack);
    } catch (error)
    {
        console.error("error createing track", error);
        res.status(500).json({
            message: "Failed to create a track",
            error
        })
    }
};


// get all tracks

export const getAllTracksByBus = async (req: Request, res: Response) => {
    try {
        const filters: any = {};

        if (req.query.bus_id) filters["bus_meta.bus_id"] = req.query.bus_id;
        if (req.query.route) filters["bus_meta.route"] = req.query.route;

        const tracks = await Track.find(filters)
        .populate("bus_meta.bus_id", "fleet_no route")
        .populate("near stop_id", "name location")
        .sort({ ts: -1 });

        res.status(200).json(tracks);
    } catch (error){
        console.error("Error fetching tracks");
        res.status(500).json({
            message: "Failed to fetch tracks",
            error
        });
    }
};

// get latest track 

export const getLatestTrack = async (req: Request, res: Response) => {
    try {
        const { busId } = req.params;
        const latestTrack = await Track.findOne({ "bus_meta.bus_id" : busId})
        .sort({ ts: -1 })
        .populate("near_stop_id", "name location");
        if (!latestTrack){
            return res.status(404).json({
                message: "No track found with this bus.",
            })
        }
        res.status(200).json(latestTrack);
    } catch (error) {
        console.error("Error getting latest track: ", error);
        res.status(500).json({
            message: "Failed to fetch the latest track",
            error
        });
    }
};

// get near trakc a specific location (withting 500m by default)

export const getTrackNearBy = async (req: Request, res: Response) => {
    try{
        const {lat, lng, radius = 500} = req.query;
    
        if (!lng || !lat){
            return res.status(400).json({
                message: "Missing longitude or latitude",
            });
       }
    
       const tracks = await Track.find({
        loc: {
            $near: {
                $geometry: { type: "Point", coordinates : [parseFloat(lat as string), parseFloat(lng as string)]},
                $maxDistance: Number(radius),
            },
        },
       }).limit(20);
    
       res.status(200).json(tracks);
    } catch (error) {
        console.error("Error fetching nearby tracks: ", error);
        res.status(500).json({
            message: "failed to fetch the nearby track.",
            error
        });
    }
}