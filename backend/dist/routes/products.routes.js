"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_js_1 = require("../controllers/products.controller.js");
const router = (0, express_1.Router)();
router.get("/", products_controller_js_1.getAllProducts);
router.get("/:id", products_controller_js_1.getProductById);
router.post("/", products_controller_js_1.createProduct);
exports.default = router;
