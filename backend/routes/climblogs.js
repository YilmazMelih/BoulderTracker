import express from "express";
import { openDB } from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authenticateToken, async (req, res) => {
    const { sessionId } = req.params;
    const { climb_id, attempts, flashed, topped } = req.body;
    if (!sessionId || !climb_id || !attempts) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if ((flashed && !topped) || (flashed && !JSON.parse(topped))) {
        return res.status(400).json({ message: "Topped must be true if flashed" });
    }
    let db;
    try {
        db = await openDB();
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

router.get("/", authenticateToken, async (req, res) => {
    const { sessionId } = req.params;
    let db;
    try {
        db = await openDB();
        const session = await db.get(`SELECT * FROM sessions WHERE user_id=? AND id=?`, [
            req.user.userId,
            sessionId,
        ]);
        if (!session) {
            return res.status(403).json({ message: "No such session exists for the user" });
        }

        const logs = await db.all(
            `SELECT C.id, C.name, C.grade, C.color, L.id, L.attempts, L.flashed, L.topped FROM climb_logs L JOIN climbs C ON L.climb_id = C.id WHERE L.session_id = ?`,
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

router.put("/:logId", authenticateToken, async (req, res) => {
    const { sessionId, logId } = req.params;
    const { attempts, topped, flashed } = req.body;
    if (!attempts) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if ((flashed && !topped) || (flashed && !JSON.parse(topped))) {
        return res.status(400).json({ message: "Topped must be true if flashed" });
    }
    let db;
    try {
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

router.delete("/:logId", authenticateToken, async (req, res) => {
    const { sessionId, logId } = req.params;
    let db;
    try {
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
