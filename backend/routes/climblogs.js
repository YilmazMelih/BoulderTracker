import express from "express";
import { openDB } from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

//Climb logs router
const router = express.Router({ mergeParams: true });

//POST route, creates log if authenticated
router.post("/", authenticateToken, async (req, res) => {
    //Extract and confirm fields
    const { sessionId } = req.params;
    const { climb_id, attempts, flashed, topped } = req.body;
    if (!sessionId || !climb_id || !attempts) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    //Enforce topped = true if flashed = true
    if ((flashed && !topped) || (flashed && !JSON.parse(topped))) {
        return res.status(400).json({ message: "Topped must be true if flashed" });
    }

    let db;
    try {
        db = await openDB();
        //Verify session and climb belongs to user
        const session = await db.get(`SELECT * FROM sessions WHERE user_id=? AND id=?`, [
            req.user.userId,
            sessionId,
        ]);
        const climb = await db.get(`SELECT * FROM climbs WHERE user_id=? AND id=?`, [
            req.user.userId,
            climb_id,
        ]);
        if (!session || !climb) {
            return res.status(403).json({ message: "No such session/climb exists for the user" });
        }

        //Create new log in DB, return it to user
        const result = await db.run(
            `INSERT INTO climb_logs (session_id, climb_id, attempts, flashed, topped) VALUES (?,?,?,?,?)`,
            sessionId,
            climb_id,
            attempts,
            flashed || 0,
            topped || 0
        );
        const newLog = await db.get(`SELECT * FROM climb_logs WHERE id=?`, result.lastID);
        res.status(201).json({
            message: "Climb logged successfully",
            log: newLog,
        });
    } catch (err) {
        console.error("Error logging climb", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//GET route, returns all logs belonging to user
router.get("/", authenticateToken, async (req, res) => {
    //Extract sessionID
    const { sessionId } = req.params;
    let db;
    try {
        //Verify session belongs to user
        db = await openDB();
        const session = await db.get(`SELECT * FROM sessions WHERE user_id=? AND id=?`, [
            req.user.userId,
            sessionId,
        ]);
        if (!session) {
            return res.status(403).json({ message: "No such session exists for the user" });
        }

        //Return logs and climb attached to logs belonging to user
        const logs = await db.all(
            `SELECT climbs.*, climb_logs.* FROM climb_logs JOIN climbs ON climb_logs.climb_id = climbs.id WHERE climb_logs.session_id = ?`,
            [sessionId]
        );
        res.json({ logs });
    } catch (err) {
        console.error("Error fetching climbs from log", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//PUT route, replaces corresponding log with provided values
router.put("/:logId", authenticateToken, async (req, res) => {
    //Extract and confirm fields
    const { sessionId, logId } = req.params;
    const { attempts, topped, flashed } = req.body;
    if (!attempts) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    //Enforce topped = true if flashed = true
    if ((flashed && !topped) || (flashed && !JSON.parse(topped))) {
        return res.status(400).json({ message: "Topped must be true if flashed" });
    }

    let db;
    try {
        //Verify log and session belongs to user
        db = await openDB();
        const log = await db.get(`SELECT * FROM climb_logs WHERE id=? AND session_id=?`, [
            logId,
            sessionId,
        ]);
        const session = await db.get(`SELECT * FROM sessions WHERE user_id=? AND id=?`, [
            req.user.userId,
            sessionId,
        ]);
        if (!log || !session) {
            return res.status(403).json({ message: "No such log/session exists for the user" });
        }

        //Update log with new fields, return updated log
        await db.run(`UPDATE climb_logs SET attempts=?, flashed=?, topped=? WHERE id=?`, [
            attempts,
            flashed || 0,
            topped || 0,
            logId,
        ]);
        const newLog = await db.get(`SELECT * FROM climb_logs WHERE id=?`, logId);
        res.json({ message: "Log updated successfully", log: newLog });
    } catch (err) {
        console.error("Error updating log", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//DELETE route, deletes the corresponding log
router.delete("/:logId", authenticateToken, async (req, res) => {
    const { sessionId, logId } = req.params;
    let db;
    try {
        db = await openDB();
        //Verify log and session belongs to user
        const log = await db.get(`SELECT * FROM climb_logs WHERE id=? AND session_id=?`, [
            logId,
            sessionId,
        ]);
        const session = await db.get(`SELECT * FROM sessions WHERE user_id=? AND id=?`, [
            req.user.userId,
            sessionId,
        ]);
        if (!log || !session) {
            return res.status(403).json({ message: "No such log/session exists for the user" });
        }

        //Delete log from DB
        await db.run(`DELETE FROM climb_logs WHERE id=?`, logId);
        res.json({ message: "Log deleted successfully", logId: logId });
    } catch (err) {
        console.error("Error deleting log", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

export default router;
