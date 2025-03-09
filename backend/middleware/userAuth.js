import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userAuth = async (req, res, next) => {
    try {
        // Ensure the token exists in cookies
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, please login again.",
            });
        }

        // Ensure JWT secret exists
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment variables.");
            return res.status(500).json({
                success: false,
                message: "Server error. Please try again later.",
            });
        }

        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken || !decodedToken.id) {
            return res.status(403).json({
                success: false,
                message: "Invalid token, please login again.",
            });
        }

        // Attach user ID to request object
        req.user = { id: decodedToken.id };

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error("JWT Error:", error.message); // Debugging

        return res.status(403).json({
            success: false,
            message: error.name === "TokenExpiredError"
                ? "Session expired. Please login again."
                : "Invalid or malformed token.",
        });
    }
};

export default userAuth;
