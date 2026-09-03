require("dotenv").config();

const bcrypt = require("bcryptjs");

const db = require("./config/db");

const createAdmin = async () => {

    try {

        const password =
            await bcrypt.hash(
                "Admin@12345",
                12
            );

        const [result] =
            await db.execute(
                `
                INSERT INTO users
                (name, email, password)
                VALUES (?, ?, ?)
                `,
                [
                    "System Admin",
                    "admin@example.com",
                    password
                ]
            );

        const userId =
            result.insertId;

        const [roles] =
            await db.execute(
                `
                SELECT id
                FROM roles
                WHERE name = 'Admin'
                `
            );

        const adminRoleId =
            roles[0].id;

        await db.execute(
            `
            INSERT INTO user_roles
            (user_id, role_id)
            VALUES (?, ?)
            `,
            [
                userId,
                adminRoleId
            ]
        );

        const [permissions] =
            await db.execute(
                `
                SELECT id
                FROM permissions
                `
            );

        for (const permission of permissions) {

            await db.execute(
                `
                INSERT IGNORE INTO role_permissions
                (role_id, permission_id)
                VALUES (?, ?)
                `,
                [
                    adminRoleId,
                    permission.id
                ]
            );
        }

        console.log(
            "Admin created successfully"
        );

        console.log(
            "Email: admin@example.com"
        );

        console.log(
            "Password: Admin@12345"
        );

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);
    }
};

createAdmin();