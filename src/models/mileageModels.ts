import mongoose,{ Schema,Document} from "mongoose";

interface MileageEntry extends Document{
    date: Date;
    milesDriven: number;
    fuelAdded: number;
    fuelEfficiency: number;
}

const MileageSchema: Schema = new Schema({
    date: { type: Date, required: true},
    milesDriven: { type: Number, required: true},
    fuelAdded: {type: Number, required: true},
    fuelEfficiency: { type: Number}
  
});

const MileageEntry = mongoose.model<MileageEntry>("MileageEntry", MileageSchema);

export default MileageSchema