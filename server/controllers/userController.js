const bcrypt = require("bcryptjs");

const db = require("../config/db");

const {
    logActivity
} = require("../utils/auditLogger");


// GET USERS
const getUsers = async (req, res, next) => {

    try {

        const [users] = await db.execute(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.status,
                u.last_login,
                u.created_at,

                GROUP_CONCAT(r.name) AS roles

            FROM users u

            LEFT JOIN user_roles ur
                ON u.id = ur.user_id

            LEFT JOIN roles r
                ON ur.role_id = r.id

            GROUP BY u.id

            ORDER BY u.created_at DESC
            `
        );

        res.json({
            success: true,
            users
        });

    } catch (error) {

        next(error);
    }
};


// CREATE USER
const createUser = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            roleId
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const [existing] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length) {

            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 12);

        const [result] = await db.execute(
            `
            INSERT INTO users
            (name, email, password)
            VALUES (?, ?, ?)
            `,
            [
                name,
                email,
                hashedPassword
            ]
        );

        const userId = result.insertId;

        if (roleId) {

            await db.execute(
                `
                INSERT INTO user_roles
                (user_id, role_id)
                VALUES (?, ?)
                `,
                [
                    userId,
                    roleId
                ]
            );
        }

        await logActivity({
            userId: req.user.id,
            action: `USER_CREATED: ${email}`,
            ipAddress: req.ip
        });

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error) {

        next(error);
    }
};


// DELETE USER
const deleteUser = async (req, res, next) => {

    try {

        const userId = req.params.id;

        if (Number(userId) === Number(req.user.id)) {

            return res.status(400).json({
                success: false,
                message: "You cannot delete yourself"
            });
        }

        await db.execute(
            "DELETE FROM users WHERE id = ?",
            [userId]
        );

        await logActivity({
            userId: req.user.id,
            action: `USER_DELETED: ${userId}`,
            ipAddress: req.ip
        });

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    getUsers,
    createUser,
    deleteUser
};