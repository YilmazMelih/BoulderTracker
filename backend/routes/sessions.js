import express from "express";

import { openDB } from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

import climbLogsRouter from "./climblogs.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    let db;
    const { date } = req.body;
    if (!date) {
        return res.status(400).json({ message: "Missing date" });
    }
    try {
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

router.use("/:sessionId/logs", climbLogsRouter);

export default router;
