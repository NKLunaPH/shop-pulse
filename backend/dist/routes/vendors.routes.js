"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendors_controller_js_1 = require("../controllers/vendors.controller.js");
const router = (0, express_1.Router)();
router.get("/", vendors_controller_js_1.getAllVendors);
router.get("/:id", vendors_controller_js_1.getVendorById);
exports.default = router;
