import { Schema, model, Document, Types } from "mongoose";

export interface ITrack extends Document {
    ts: Date; // this is the timestamp of this tracking record, it marks when this telemetry snapshot was taken
    bus_meta: { 
        bus_id: Types.ObjectId; // link to a Bus document 
        fleet_no?: string; // readable bus code 
        route?: string; // the route it's currently serving
    };
    loc: { // the geographic location of the bus at that timestamp
        type: "Point";
        coordinates: [number, number];
    };
    speed_kmh?: number;
    heading_deg?: number;
    gps?: { // raw data from gps device 
        hdop?: number; // horizontal dilution of precision
        fix?: number; // gps fix status (exemple: )
    }
    near_stop_id?:  Types.ObjectId;
    occupancy?: {
        observed?: number; // number of passengers detected (via camera or sensor)
        confidence?: number; // ai model confidenc in that estimate (0-1)
    };
    ai?: {
        predicted_arrivals?: { // predicted arrival times to upcoming stops
            stop_id: Types.ObjectId; // which stop 
            eta: Date; // estimate time of arrivale 
            uncertainty_s?: number; // prediction uncertainty in second
        }[];
        demand_forecast?: { // predicted passengers demand at upcoming stops 
            stop_id: Types.ObjectId;
            score?: number; // predicted demand value 
            horizon_min?: number; // prediction time horizon in minutes
        }[];
        best_station_suggestion?: { // ai suggestion for the optimal station or stop for the passenger;s destination or transfer
            stop_id: Types.ObjectId;
            reason?: string[];
        };
    };
    source?: string; // a string identifying where this data came from
}

const trackSchema = new Schema<ITrack>({
    ts: { type: Date, default: Date.now, index: true },
    bus_meta: {
        bus_id: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
        fleet_no: String,
        route: String,
    },
    loc: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
    },
    speed_kmh: Number,
    heading_deg: Number,
    gps: {
        hdop: Number,
        fix: Number 
    }, 
    near_stop_id: { type: Schema.Types.ObjectId, ref: "Stop" },
    occupancy: {
        observed: Number,
        confidence: Number 
    },
    ai: {
        predicted_arrivals: [{
            stop_id: { type: Schema.Types.ObjectId, ref: "Stop" },
            eta: { type: Date, default: Date.now },
            uncertainty_s: Number 
        }],
        demand_forecast: [{
            stop_id: { type: Schema.Types.ObjectId, ref: "Stop" },
            score: Number,
            horizon_min: Number
        }],
        best_station_suggestion: {
            stop_id: { type: Schema.Types.ObjectId, ref: "Stop" },
            reason: [String]
        }
    },
    source: String
});

trackSchema.index({ loc: "2dsphere"});
trackSchema.index({ "bus_meta.bus_id": 1, ts: -1});

export const Track = model<ITrack>("Track", trackSchema);



// waht is HDOP (horizontal dilution of precision) stand for :
// it measure how accurately our gps can determine our horizontal position (latitude and longitude)
