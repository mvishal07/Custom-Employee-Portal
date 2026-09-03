const express = require("express");

const {
    getUsers,
    createUser,
    deleteUser
} = require("../controllers/userController");

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
    requirePermission("MANAGE_USERS"),
    getUsers
);

router.post(
    "/",
    protect,
    requirePermission("MANAGE_USERS"),
    createUser
);

router.delete(
    "/:id",
    protect,
    requirePermission("MANAGE_USERS"),
    deleteUser
);

module.exports = router;