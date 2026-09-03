const express = require("express");

const {
    getPermissions,
    assignPermission,
    removePermission
} = require("../controllers/permissionController");

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
    requirePermission("MANAGE_PERMISSIONS"),
    getPermissions
);

router.post(
    "/assign",
    protect,
    requirePermission("MANAGE_PERMISSIONS"),
    assignPermission
);

router.post(
    "/remove",
    protect,
    requirePermission("MANAGE_PERMISSIONS"),
    removePermission
);

module.exports = router;