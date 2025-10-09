import { Schema, model, Document } from "mongoose";

export interface IStop extends Document {
    code: string;
    name: string;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    zone?: string;
    amenities?: string[];
    is_active?: boolean;
    served_routes: string[];
    demand_score?: number;
    last_demand_update?: Date;
}

const stopSchema = new Schema<IStop>({
    code : {type: String, unique: true, index: true },
    name: {type: String, unique: true, index: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    zone: String,
    amenities: [String],
    is_active: {type: Boolean, default: true},
    served_routes: [String],
    demand_score: { type: Number, default: 0},
    last_demand_update: Date
});

stopSchema.index({ location: "2dsphere" });

export const Stop = model<IStop>("Stop", stopSchema);

