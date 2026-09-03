const db = require("../config/db");

const createRole = async (req, res, next) => {

    try {

        const {
            name,
            description
        } = req.body;

        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Role name is required"
            });
        }

        await db.execute(
            `
            INSERT INTO roles
            (name, description)
            VALUES (?, ?)
            `,
            [
                name,
                description || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Role created successfully"
        });

    } catch (error) {

        next(error);
    }
};


const getRoles = async (req, res, next) => {

    try {

        const [roles] = await db.execute(
            `
            SELECT *
            FROM roles
            ORDER BY name
            `
        );

        res.json({
            success: true,
            roles
        });

    } catch (error) {

        next(error);
    }
};


const assignRole = async (req, res, next) => {

    try {

        const {
            userId,
            roleId
        } = req.body;

        await db.execute(
            `
            INSERT IGNORE INTO user_roles
            (user_id, role_id)
            VALUES (?, ?)
            `,
            [
                userId,
                roleId
            ]
        );

        res.json({
            success: true,
            message: "Role assigned successfully"
        });

    } catch (error) {

        next(error);
    }
};


const removeRole = async (req, res, next) => {

    try {

        const {
            userId,
            roleId
        } = req.body;

        await db.execute(
            `
            DELETE FROM user_roles
            WHERE user_id = ?
              AND role_id = ?
            `,
            [
                userId,
                roleId
            ]
        );

        res.json({
            success: true,
            message: "Role removed successfully"
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    createRole,
    getRoles,
    assignRole,
    removeRole
};