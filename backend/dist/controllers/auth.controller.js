"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.registerUser = exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const loginUser = async (req, res) => {
    try {
        const { email, password, role = "Shopper" } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const token = jsonwebtoken_1.default.sign({ email, role, id: "user-123" }, env_js_1.config.jwtSecret, { expiresIn: "7d" });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: "user-123",
                    name: "Alex Rivera",
                    email,
                    role,
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
                },
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.loginUser = loginUser;
const registerUser = async (req, res) => {
    try {
        const { name, email, password, accountType = "shopper" } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }
        const token = jsonwebtoken_1.default.sign({ email, role: accountType === "merchant" ? "Vendor" : "Shopper", id: `user-${Date.now()}` }, env_js_1.config.jwtSecret, { expiresIn: "7d" });
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                token,
                user: {
                    id: `user-${Date.now()}`,
                    name,
                    email,
                    role: accountType === "merchant" ? "Vendor" : "Shopper",
                },
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.registerUser = registerUser;
const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            id: "user-123",
            name: "Alex Rivera",
            email: "alex.rivera@example.com",
            role: "Shopper",
            pulsePoints: 2450,
            tier: "Diamond VIP",
        },
    });
};
exports.getCurrentUser = getCurrentUser;
