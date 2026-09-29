"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_js_1 = require("../controllers/admin.controller.js");
const router = (0, express_1.Router)();
router.get("/metrics", admin_controller_js_1.getAdminMetrics);
exports.default = router;
