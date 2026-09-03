const db = require("../config/db");

const logActivity = async ({
    userId = null,
    action,
    ipAddress = null,
    metadata = null
}) => {
    try {
        await db.execute(
            `
            INSERT INTO audit_logs
            (user_id, action, ip_address, metadata)
            VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                action,
                ipAddress,
                metadata ? JSON.stringify(metadata) : null
            ]
        );
    } catch (error) {
        console.error("Audit logging failed:", error.message);
    }
};

module.exports = {
    logActivity
};