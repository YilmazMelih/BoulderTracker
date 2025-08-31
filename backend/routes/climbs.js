import express from "express";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { openDB } from "../db.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    const { name, difficulty, photo_url } = req.body;
    if (!name || !difficulty) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    let db;
    try {
        db = await openDB();
        const result = await db.run(
            `INSERT INTO climbs (user_id, name, difficulty, photo_url)
            VALUES (?,?,?,?)`,
            req.user.userId,
            name,
            difficulty,
            photo_url || null
        );

        res.status(201).json({
            message: "Climb created successfully",
            id: result.lastID,
            user_id: req.user.userId,
            name: name,
            difficulty: difficulty,
            photo_url: photo_url || null,
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
