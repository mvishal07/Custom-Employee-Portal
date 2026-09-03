const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const {
    logActivity
} = require("../utils/auditLogger");

const generateToken = (userId) => {

    return jwt.sign(
        {
            userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};



const register = async (req, res, next) => {

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
                message: "Email already registered"
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
            userId,
            action: "USER_REGISTERED",
            ipAddress: req.ip
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {

        next(error);
    }
};


// LOGIN
const login = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await db.execute(
            `
            SELECT *
            FROM users
            WHERE email = ?
            `,
            [email]
        );

        if (!users.length) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

     
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            await logActivity({
                userId: user.id,
                action: "LOGIN_FAILED",
                ipAddress: req.ip
            });

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        await db.execute(
            `
            UPDATE users
            SET last_login = NOW()
            WHERE id = ?
            `,
            [user.id]
        );

        const token =
            generateToken(user.id);

        await logActivity({
            userId: user.id,
            action: "LOGIN_SUCCESS",
            ipAddress: req.ip
        });

        const [roles] = await db.execute(
            `
            SELECT r.id, r.name
            FROM user_roles ur
            INNER JOIN roles r
                ON ur.role_id = r.id
            WHERE ur.user_id = ?
            `,
            [user.id]
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles
            }
        });

    } catch (error) {

        next(error);
    }
};



const getMe = async (req, res, next) => {

    try {

        const [roles] = await db.execute(
            `
            SELECT r.id, r.name
            FROM user_roles ur

            INNER JOIN roles r
                ON ur.role_id = r.id

            WHERE ur.user_id = ?
            `,
            [req.user.id]
        );

        const [permissions] = await db.execute(
            `
            SELECT DISTINCT p.name
            FROM user_roles ur

            INNER JOIN role_permissions rp
                ON ur.role_id = rp.role_id

            INNER JOIN permissions p
                ON rp.permission_id = p.id

            WHERE ur.user_id = ?
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            user: {
                ...req.user,
                roles,
                permissions:
                    permissions.map(p => p.name)
            }
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    register,
    login,
    getMe
};