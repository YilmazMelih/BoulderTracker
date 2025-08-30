import express from "express";
import cors from "cors";
import "dotenv/config";

const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API IS RUNNING");
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
