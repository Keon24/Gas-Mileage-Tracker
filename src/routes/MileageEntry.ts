import MileageEntry from "../models/MileageEntry";
import express, { Request, Router, Response } from 'express';

// Define the structure of the request body
interface MileageEntryBody {
    date: string;
    milesDriven: number;
    fuelAdded: number;
}

const router: Router = express.Router();

router.post(
    '/add',
    async (req: Request<{}, {}, MileageEntryBody>, res: Response): Promise<void> => {
        try {
            const { date, milesDriven, fuelAdded } = req.body;

            // Validate required fields
            if (!date || !milesDriven || !fuelAdded) {
                res.status(400).json({ message: "All fields are required." });
                return;
            }

            // Calculate fuel efficiency
            const fuelEfficiency = milesDriven / fuelAdded;

            // Create a new mileage entry
            const newEntry = new MileageEntry({
                date,
                milesDriven,
                fuelAdded,
                fuelEfficiency,
            });

            // Save the new entry to the database
            await newEntry.save();

            // Send success response
            res.status(201).json({
                message: "Mileage entry saved successfully.",
                entry: newEntry,
            });
        } catch (error) {
            console.error('Error saving mileage entry:', error);
            res.status(500).json({ message: 'Failed to save mileage entry.' });
        }
    }
);

export default router;