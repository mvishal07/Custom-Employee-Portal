const express = require("express");

const {
    getServices,
    getCRMContacts,
    getBooksOrganizations,
    getDeskOrganizations
} = require("../controllers/zohoController");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    requirePermission
} = require("../middleware/rbacMiddleware");

const router = express.Router();


// Services visible to current employee
router.get(
    "/services",
    protect,
    getServices
);


// CRM
router.get(
    "/crm/contacts",
    protect,
    requirePermission("VIEW_ZOHO_CRM"),
    getCRMContacts
);


// Books
router.get(
    "/books/organizations",
    protect,
    requirePermission("VIEW_ZOHO_BOOKS"),
    getBooksOrganizations
);


// Desk
router.get(
    "/desk/organizations",
    protect,
    requirePermission("VIEW_ZOHO_DESK"),
    getDeskOrganizations
);

module.exports = router;