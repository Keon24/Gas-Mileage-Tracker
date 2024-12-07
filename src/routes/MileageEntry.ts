import MileageEntry from "../models/MileageEntry";
import express, { Request, Router, Response } from "express";

// Define the structure of the request body
interface MileageEntryBody {
    date: string;
    milesDriven: number;
    fuelAdded: number;
}

const router: Router = express.Router();

// POST: Add a new mileage entry
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

// GET: Retrieve mileage entries from the past 7 days
router.get(
    '/past', // Define the endpoint path
    async (req: Request, res: Response): Promise<void> => {
        try {
            /* Calculate the past days */
            const currentDate: Date = new Date(); 
            const sevenDaysAgo: Date = new Date(currentDate); 
            sevenDaysAgo.setDate(currentDate.getDate() - 7); 

            /* Find and compare the dates */
            const entries = await MileageEntry.find({
                date: {
                    $gte: sevenDaysAgo, 
                    $lte: currentDate,  
                },
            })
                .select('milesDriven fuelAdded') 
                .sort({ date: -1 }); 

            // Check if no entries are found
            if (entries.length === 0) {
                res.status(200).json({ message: 'No entries found in the past 7 days.' });
                return;
            }

            /* Return the entries */
            res.status(200).json(entries);
        } catch (error) {
            console.error("There was an error fetching your entries:", error);
            res.status(500).json({ message: "Failed to fetch mileage entries." });
        }
    }
);

export default router;
