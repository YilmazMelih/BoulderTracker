import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { openDB } from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: "Error, missing required fields" });
        return;
    }
    let db;
    try {
        db = await openDB();

        const email_exists = await db.get(`SELECT * FROM users WHERE email=?`, email);
        if (email_exists) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const username_exists = await db.get(`SELECT * FROM users WHERE username=?`, username);
        if (username_exists) {
            return res.status(409).json({ message: "Username already in use" });
        }
        const password_hash = await bcrypt.hash(password, 10);
        const result = await db.run(
            `INSERT INTO users (username, email, password_hash) VALUES (?,?,?)`,
            username,
            email,
            password_hash
        );
        res.status(201).json({ message: "User created successfully!", userId: result.lastID });
    } catch (err) {
        console.error("Error signing up", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }
    let db;
    try {
        db = await openDB();
        const user = await db.get(`SELECT * FROM users WHERE email=?`, email);
        if (!user) {
            res.status(401).json({ message: "Incorrect email or password" });
            return;
        }
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            res.status(401).json({ message: "Incorrect email or password" });
            return;
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || "devsecret",
            { expiresIn: "1h" }
        );
        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error logging in", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

export default router;
