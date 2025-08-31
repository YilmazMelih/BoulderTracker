import express from "express";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { openDB } from "../db.js";

//Climbs router
const router = express.Router();

//POST route, creates climb if authenticated
router.post("/", authenticateToken, async (req, res) => {
    //Extract and confirm required fields
    const { name, grade, photo_url, color } = req.body;
    if (!name || !grade) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    let db;
    try {
        //Create new climb in DB, return it to user
        db = await openDB();
        const result = await db.run(
            `INSERT INTO climbs (user_id, name, grade, photo_url, color)
            VALUES (?,?,?,?, ?)`,
            req.user.userId,
            name,
            grade,
            photo_url || null,
            color || "#ffffff"
        );
        const newClimb = await db.get(`SELECT * FROM climbs WHERE id=?`, result.lastID);

        res.status(201).json({
            message: "Climb created successfully",
            climb: newClimb,
        });
    } catch (err) {
        console.error("Error creating climb", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//GET route, returns all climbs belonging to user if authenticated
router.get("/", authenticateToken, async (req, res) => {
    let db;
    try {
        db = await openDB();
        const climbs = await db.all(`SELECT * FROM climbs WHERE user_id=?`, [req.user.userId]);
        return res.json({ climbs });
    } catch (err) {
        console.error("Error fetching climbs", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

export default router;
