"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_js_1 = require("../controllers/orders.controller.js");
const router = (0, express_1.Router)();
router.get("/", orders_controller_js_1.getCustomerOrders);
router.get("/:id", orders_controller_js_1.getOrderById);
router.post("/checkout", orders_controller_js_1.createCheckoutOrder);
exports.default = router;
