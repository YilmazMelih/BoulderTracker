import express from "express";
import Joi from "joi";
import { openDB } from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

import climbLogsRouter from "./climblogs.js";

//Schemas for input validation
const sessionSchema = Joi.object({
    date: Joi.date().required(),
});

//Sessions route
const router = express.Router();

//POST route, creates new session if authenticated
router.post("/", authenticateToken, async (req, res) => {
    //Extracts and validates field
    const { error, value } = sessionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const date = new Date(value.date);

    let db;
    try {
        //Create new session in DB, return it to user
        db = await openDB();
        const result = await db.run(
            `INSERT INTO sessions (user_id, date)
            VALUES (?,?)`,
            req.user.userId,
            date.toISOString()
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
    //Build query using query params
    let query = `SELECT * FROM sessions WHERE user_id=?`;
    let params = [req.user.userId];
    const { on, to, from } = req.query;
    if (on) {
        query += ` AND date = ?`;
        params.push(on);
    }
    if (from) {
        query += ` AND date >= ?`;
        params.push(from);
    }
    if (to) {
        query += ` AND DATE <= ?`;
        params.push(to);
    }

    let db;
    try {
        //Return query
        db = await openDB();
        const sessions = await db.all(query, params);
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

//DELETE route, deletes the corresponding climb
router.delete("/:sessionId", authenticateToken, async (req, res) => {
    const { sessionId } = req.params;
    let db;
    try {
        db = await openDB();
        //Verify session belongs to user
        const session = await db.get(`SELECT * FROM sessions WHERE id=? AND user_id=?`, [
            sessionId,
            req.user.userId,
        ]);
        if (!session) {
            return res.status(403).json({ message: "No such session exists for the user" });
        }

        //Delete session from DB
        await db.run(`DELETE FROM sessions WHERE id=?`, sessionId);
        res.json({ message: "Session deleted successfully", sessionId: sessionId });
    } catch (err) {
        console.error("Error deleting session", err);
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
