"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./config/env.js");
const db_js_1 = require("./config/db.js");
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const products_routes_js_1 = __importDefault(require("./routes/products.routes.js"));
const orders_routes_js_1 = __importDefault(require("./routes/orders.routes.js"));
const vendors_routes_js_1 = __importDefault(require("./routes/vendors.routes.js"));
const admin_routes_js_1 = __importDefault(require("./routes/admin.routes.js"));
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [env_js_1.config.clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.get("/api/health", (req, res) => {
    const isDbConnected = mongoose_1.default.connection.readyState === 1;
    res.status(200).json({
        status: "ok",
        service: "ShopPulse API Server",
        database: {
            connected: isDbConnected,
            name: mongoose_1.default.connection.name || "shoppulse",
            host: mongoose_1.default.connection.host,
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/products", products_routes_js_1.default);
app.use("/api/orders", orders_routes_js_1.default);
app.use("/api/vendors", vendors_routes_js_1.default);
app.use("/api/admin", admin_routes_js_1.default);
app.use(error_middleware_js_1.notFoundHandler);
app.use(error_middleware_js_1.errorHandler);
const PORT = env_js_1.config.port;
const startServer = async () => {
    await (0, db_js_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(`🚀 ShopPulse Express API Server is Running!`);
        console.log(`📡 Port: http://localhost:${PORT}`);
        console.log(`🗄️ MongoDB: ${env_js_1.config.mongoUri}`);
        console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
        console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
        console.log(`=========================================`);
    });
};
startServer();
exports.default = app;
