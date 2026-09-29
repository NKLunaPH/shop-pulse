"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminMetrics = void 0;
const mockData_js_1 = require("../data/mockData.js");
const getAdminMetrics = async (req, res) => {
    const totalGMV = mockData_js_1.ORDERS_DB.reduce((sum, o) => sum + o.total, 0) + 1428950;
    const platformRevenue = totalGMV * 0.15;
    return res.status(200).json({
        success: true,
        data: {
            metrics: {
                gmv: totalGMV,
                revenue: platformRevenue,
                activeVendors: mockData_js_1.VENDORS_DB.length,
                totalProducts: mockData_js_1.PRODUCTS_DB.length,
                totalOrders: mockData_js_1.ORDERS_DB.length + 24590,
                liveShoppers: 3842,
            },
            systemHealth: {
                status: "Operational",
                uptime: "99.99%",
                edgeServersOnline: 14,
            },
        },
    });
};
exports.getAdminMetrics = getAdminMetrics;
