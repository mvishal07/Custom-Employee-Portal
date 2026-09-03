const express = require("express");

const {
    createRole,
    getRoles,
    assignRole,
    removeRole
} = require("../controllers/roleController");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    requirePermission
} = require("../middleware/rbacMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    requirePermission("MANAGE_ROLES"),
    getRoles
);

router.post(
    "/",
    protect,
    requirePermission("MANAGE_ROLES"),
    createRole
);

router.post(
    "/assign",
    protect,
    requirePermission("MANAGE_ROLES"),
    assignRole
);

router.post(
    "/remove",
    protect,
    requirePermission("MANAGE_ROLES"),
    removeRole
);

module.exports = router;