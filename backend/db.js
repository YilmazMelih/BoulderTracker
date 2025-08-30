import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
    return open({
        filename: "./db.sqlite",
        driver: sqlite3.Database,
    });
}

export async function setupDB() {
    const db = await openDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT_CURRENT_TIMESTAMP
        pfp_url TEXT
        )
        `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS climbs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        photo_url TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);
    console.log("Tables created");
    await db.close();
}
