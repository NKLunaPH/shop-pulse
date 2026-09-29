"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_js_1.loginUser);
router.post("/register", auth_controller_js_1.registerUser);
router.get("/me", auth_controller_js_1.getCurrentUser);
exports.default = router;
