import express from "express";
import cors from "cors";
import "dotenv/config";

import { openDB, setupDB } from "./db.js";
import authRouter from "./routes/auth.js";
import climbsRouter from "./routes/climbs.js";
import sessionsRouter from "./routes/sessions.js";

//Database debug

// setupDB().catch((err) => console.error(err));

const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/api/climbs", climbsRouter);
app.use("/api/sessions", sessionsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
