const db = require("../config/db");

const getPermissions = async (req, res, next) => {

    try {

        const [permissions] = await db.execute(
            `
            SELECT *
            FROM permissions
            ORDER BY name
            `
        );

        res.json({
            success: true,
            permissions
        });

    } catch (error) {

        next(error);
    }
};


const assignPermission = async (req, res, next) => {

    try {

        const {
            roleId,
            permissionId
        } = req.body;

        await db.execute(
            `
            INSERT IGNORE INTO role_permissions
            (role_id, permission_id)
            VALUES (?, ?)
            `,
            [
                roleId,
                permissionId
            ]
        );

        res.json({
            success: true,
            message: "Permission assigned successfully"
        });

    } catch (error) {

        next(error);
    }
};


const removePermission = async (req, res, next) => {

    try {

        const {
            roleId,
            permissionId
        } = req.body;

        await db.execute(
            `
            DELETE FROM role_permissions
            WHERE role_id = ?
              AND permission_id = ?
            `,
            [
                roleId,
                permissionId
            ]
        );

        res.json({
            success: true,
            message: "Permission removed successfully"
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    getPermissions,
    assignPermission,
    removePermission
};