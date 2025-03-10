import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Get token from cookies

        if (!token) {
            console.log(error.message);
            return res.status(401).json({
                success: false,
                message: "Not authorized, please login again.",
                error: error.message
            });
        }

        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken?.id) {
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
            message: "Invalid or expired token.",
            error: error.message
        });
    }
};

export default userAuth;