const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [users] = await db.execute(
            `
            SELECT id, name, email, status
            FROM users
            WHERE id = ?
            `,
            [decoded.userId]
        );

        if (!users.length) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const user = users[0];

      
        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = {
    protect
};