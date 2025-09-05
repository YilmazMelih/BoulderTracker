import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
    const db = await open({
        filename: "./db.sqlite",
        driver: sqlite3.Database,
    });
    await db.exec("PRAGMA foreign_keys = ON;");
    return db;
}

export async function setupDB() {
    const db = await openDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        pfp_url TEXT
        )
        `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS climbs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        photo_url TEXT,
        color TEXT DEFAULT '#ffffff',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS sessions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS climb_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        climb_id INTEGER NOT NULL,
        attempts INTEGER NOT NULL,
        flashed BOOLEAN,
        topped BOOLEAN,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (climb_id) REFERENCES climbs(id) ON DELETE CASCADE
        )
        `);

    await db.close();
}
