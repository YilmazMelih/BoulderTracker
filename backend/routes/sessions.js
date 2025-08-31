import express from "express";

import { openDB } from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

import climbLogsRouter from "./climblogs.js";

//Sessions route
const router = express.Router();

//POST route, creates new session if authenticated
router.post("/", authenticateToken, async (req, res) => {
    //Extracts and confirms field
    const { date } = req.body;
    if (!date) {
        return res.status(400).json({ message: "Missing date" });
    }

    let db;
    try {
        //Create new session in DB, return it to user
        db = await openDB();
        const result = await db.run(
            `INSERT INTO sessions (user_id, date)
            VALUES (?,?)`,
            req.user.userId,
            date
        );
        const newSession = await db.get(`SELECT * FROM sessions WHERE id=?`, result.lastID);

        res.status(201).json({
            message: "Session created successfully",
            session: newSession,
        });
    } catch (err) {
        console.error("Error creating session", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//GET route, returns all sessions belonging to user if authenticated
router.get("/", authenticateToken, async (req, res) => {
    let db;
    try {
        db = await openDB();
        const sessions = await db.all(`SELECT * FROM sessions WHERE user_id=?`, [req.user.userId]);
        return res.json({ sessions });
    } catch (err) {
        console.error("Error fetching sessions", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//Use climbLogsRouter for log routes
router.use("/:sessionId/logs", climbLogsRouter);

export default router;
