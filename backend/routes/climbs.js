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

//PUT route, replaces corresponding climb with provided values
router.put("/:climbId", authenticateToken, async (req, res) => {
    //Extract fields
    const { climbId } = req.params;
    const { name, grade, color, photo_url } = req.body;

    let db;
    try {
        //Verify climb belongs to user
        db = await openDB();
        const oldClimb = await db.get(`SELECT * FROM climbs WHERE id=? AND user_id=?`, [
            climbId,
            req.user.userId,
        ]);
        if (!oldClimb) {
            return res.status(403).json({ message: "No such climb exists for the user" });
        }

        //Update climb with new fields, return updated log
        await db.run(`UPDATE climbs SET name=?, grade=?, color=?, photo_url=? WHERE id=?`, [
            name || oldClimb.name,
            grade || oldClimb.grade,
            color || oldClimb.color,
            photo_url || oldClimb.photo_url,
            climbId,
        ]);
        const newClimb = await db.get(`SELECT * FROM climbs WHERE id=?`, climbId);
        res.json({ message: "Climb updated successfully", climb: newClimb });
    } catch (err) {
        console.error("Error updating log", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//DELETE route, deletes the corresponding climb
router.delete("/:climbId", authenticateToken, async (req, res) => {
    const { climbId } = req.params;
    let db;
    try {
        db = await openDB();
        //Verify climb belongs to user
        const climb = await db.get(`SELECT * FROM climbs WHERE id=? AND user_id=?`, [
            climbId,
            req.user.userId,
        ]);
        if (!climb) {
            return res.status(403).json({ message: "No such climb exists for the user" });
        }

        //Delete climb from DB
        await db.run(`DELETE FROM climbs WHERE id=?`, climbId);
        res.json({ message: "Climb deleted successfully", climbId: climbId });
    } catch (err) {
        console.error("Error deleting climb", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

export default router;
