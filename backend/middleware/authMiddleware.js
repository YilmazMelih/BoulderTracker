import jwt from "jsonwebtoken";

//Token authentication middleware
export function authenticateToken(req, res, next) {
    //Extract and confirm token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    //Verify JWT token, attach user to req if valid
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
}
