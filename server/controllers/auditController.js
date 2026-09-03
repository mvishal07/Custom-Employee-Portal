const db = require("../config/db");

const getAuditLogs = async (req, res, next) => {

    try {

        const [logs] = await db.execute(
            `
            SELECT
                a.id,
                a.action,
                a.ip_address,
                a.metadata,
                a.created_at,
                u.name,
                u.email

            FROM audit_logs a

            LEFT JOIN users u
                ON a.user_id = u.id

            ORDER BY a.created_at DESC

            LIMIT 200
            `
        );

        res.json({
            success: true,
            logs
        });

    } catch (error) {

        next(error);
    }
};

module.exports = {
    getAuditLogs
};