import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { openDB } from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

//Schemas for input validation
const signupSchema = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

//Auth router
const router = express.Router();

//Signup route, creates new user in DB and provides JWT token
router.post("/signup", async (req, res) => {
    //Extract and validate inputs
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { username, email, password } = value;

    let db;
    try {
        db = await openDB();

        //Check for duplicate email and username
        const email_exists = await db.get(`SELECT * FROM users WHERE email=?`, email);
        if (email_exists) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const username_exists = await db.get(`SELECT * FROM users WHERE username=?`, username);
        if (username_exists) {
            return res.status(409).json({ message: "Username already in use" });
        }

        //Hash password, create user in DB
        const password_hash = await bcrypt.hash(password, 10);
        const result = await db.run(
            `INSERT INTO users (username, email, password_hash) VALUES (?,?,?)`,
            username,
            email,
            password_hash
        );

        //Create and return token
        const token = jwt.sign(
            { userId: result.lastID, username: username },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );
        res.status(201).json({
            message: "User created successfully!",
            userId: result.lastID,
            token: token,
        });
    } catch (err) {
        console.error("Error signing up", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

//Login route, logs existing user in and provides JWT token
router.post("/login", async (req, res) => {
    //Extract and validate inputs
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = value;

    let db;
    try {
        db = await openDB();

        //Verify email and password
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

        //Create and return JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
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

//DELETE route, deletes the corresponding user
router.delete("/delete/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;
    let db;
    try {
        db = await openDB();
        //Verify user
        if (req.user.userId != userId) {
            return res.status(403).json({ message: "Cannot delete other users" });
        }

        //Delete user from DB
        await db.run(`DELETE FROM users WHERE id=?`, userId);
        res.json({ message: "User deleted successfully", userId: userId });
    } catch (err) {
        console.error("Error deleting user", err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (db) {
            await db.close();
        }
    }
});

export default router;
