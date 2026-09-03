const express = require("express");

const {
    getAuditLogs
} = require("../controllers/auditController");

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
    requirePermission("VIEW_AUDIT_LOGS"),
    getAuditLogs
);

module.exports = router;