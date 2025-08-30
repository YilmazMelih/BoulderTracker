import express from "express";
import bcrypt from "bcrypt";
import { openDB } from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: "Error, missing required fields" });
        return;
    }
    try {
        const db = await openDB();
        const password_hash = await bcrypt.hash(password, 10);
        const result = await db.run(
            `INSERT INTO users (username, email, password_hash) VALUES (?,?,?)`,
            username,
            email,
            password_hash
        );
        await db.close();
        res.status(201).json({ message: "User created successfully!", userId: result.lastID });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
