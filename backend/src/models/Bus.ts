import { Schema, model, Document, Type } from "mongoose";

export interface IBus extends Document {
    fleet_no: string; // the unique internal bus number
    plate?: string; // the licence plate number
    operator?: string; // which bus company run this bus
    model?: string; // bus model like mercedes wla volvo wla chihaja akhra
    capacity?: { // how many passenger can bus take seated and standing 
        seated?: number;
        standing?: number;
    };
    features?: string[]; // list of extra features bhal wifi (ofc la hh)
    status: "IN_SERVICE" | "OUT_OF_SERVICE" | "MAINTENANCE"; // current status of the bus
    assigned_routes?: string; // the route number wla id this bus is currently assigned to 
    current_trip_id?: string; // id of the current trip/journey the bus is on
    last_telemetry?: { // telemetry: hte latest real-time data sent by the bus.
        ts: Date; // timestamp when this telemetry was recorded
        location: { // GeoJSON location of the bus right now.
            type: "Point";
            coordinates: [number, number];
        };
        speed_kmh?: number; // bus speed in km/h
        heading_deg?: number; // direction of mouvement in degrees 
        near_stop_id?: Types.ObjectId; // the stop that is closet to this bus right now, it is stored as a reference to a Stop document in MongoDB
        occupancy?: { // info about how many people are inside
            observed?: number; // estimate passengers count (from camera or sensor)
            confidence?: number; // ai model confidence from 0 -> 1
        };
        anomalies?: string[]; // list of detected problems
    };
}

const busSchema = new Schema<IBus>({
    fleet_no: {type: String, required: true, unique: true },
    plate: {type: String, unique: true, sparse: true },
    operator: String,
    model: String,
    capacity: {
        seated: Number;
        standing: Number;
    },
    features: [String],
    status: {
        type: String,
        enum: ["IN_SERVICE", "OUT_OF_SERVICE", "MAINTENACE"],
        default: "IN_SERVICE"
    },
    assigned_route: String,
    current_trip_id: String,
    last_telemetry: {
        ts: {type: Date, default: Date.now },
        location: {
            type: {type: String, enum: ["Point"], default: "Point"},
            coordinates: [Number]
        },
        speed_kmh: Number;
        heading_deg: Number;
        near_stop_id: {type: Schema.Types.ObjectId, ref: "Stop"},
        occupancy: {
            observed: Number,
            confidance: Number
        },
        anomalies: [String]
    }
});

busSchema.index({ "last_telemetry.location": "2dsphere" });

export const Bus = model<IBus>("Bus", busSchema);
 
// busSchema.index({ "last_telemetry.location": "2dsphere" });
// what this line do:
// - it create a geospatial indes on the field last_telemetry.location
// "2dsphere" is a specila index type in MongoDB that support geographical queries on earth 
// why we need it:
// in MongoDB if we want to ask thing like:
// "find all buses within 2 Km of this stop"
// "which bus is closet to me right now"
// "list buses that are inside this polygon (the city center)"
// we can only do those queries if hte field has 2dsphere index.
// without this index, MongoDB cannot perform $near or $geoWithin queries efficiently.
//
// summary:
// index() = tells MongoDB to build a lookup table for faster quiries
// "2dsphere" = index for earch coordinates (lat/lon)
