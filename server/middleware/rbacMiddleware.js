const db = require("../config/db");

const requirePermission = (permissionName) => {

    return async (req, res, next) => {

        try {

            const [rows] = await db.execute(
                `
                SELECT DISTINCT p.name
                FROM user_roles ur

                INNER JOIN role_permissions rp
                    ON ur.role_id = rp.role_id

                INNER JOIN permissions p
                    ON rp.permission_id = p.id

                WHERE ur.user_id = ?
                  AND p.name = ?
                `,
                [
                    req.user.id,
                    permissionName
                ]
            );

            if (!rows.length) {

                return res.status(403).json({
                    success: false,
                    message: "You do not have permission"
                });
            }

            next();

        } catch (error) {

            next(error);
        }
    };
};

module.exports = {
    requirePermission
};