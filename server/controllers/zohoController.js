const db = require("../config/db");

const {
    zohoRequest
} = require("../services/zohoService");


// GET AVAILABLE SERVICES FOR USER
const getServices = async (req, res, next) => {

    try {

        const [services] = await db.execute(
            `
            SELECT
                zs.id,
                zs.service_name,
                zs.display_name,
                zs.description,
                zs.url

            FROM zoho_services zs

            INNER JOIN permissions p
                ON zs.permission_name = p.name

            INNER JOIN role_permissions rp
                ON p.id = rp.permission_id

            INNER JOIN user_roles ur
                ON rp.role_id = ur.role_id

            WHERE ur.user_id = ?
              AND zs.is_active = TRUE

            GROUP BY zs.id

            ORDER BY zs.display_name
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            services
        });

    } catch (error) {

        next(error);
    }
};


// CRM
const getCRMContacts = async (req, res, next) => {

    try {

        const data = await zohoRequest({
            service: "crm",
            method: "GET",
            url:
                `${process.env.ZOHO_CRM_API}/Contacts`
        });

        res.json({
            success: true,
            data
        });

    } catch (error) {

        next(error);
    }
};


// BOOKS
const getBooksOrganizations = async (
    req,
    res,
    next
) => {

    try {

        const data = await zohoRequest({
            service: "books",
            method: "GET",
            url:
                `${process.env.ZOHO_BOOKS_API}/organizations`
        });

        res.json({
            success: true,
            data
        });

    } catch (error) {

        next(error);
    }
};


// DESK
const getDeskOrganizations = async (
    req,
    res,
    next
) => {

    try {

        const data = await zohoRequest({
            service: "desk",
            method: "GET",
            url:
                `${process.env.ZOHO_DESK_API}/organizations`
        });

        res.json({
            success: true,
            data
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    getServices,
    getCRMContacts,
    getBooksOrganizations,
    getDeskOrganizations
};