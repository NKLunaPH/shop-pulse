"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorById = exports.getAllVendors = void 0;
const mockData_js_1 = require("../data/mockData.js");
const getAllVendors = async (req, res) => {
    return res.status(200).json({
        success: true,
        count: mockData_js_1.VENDORS_DB.length,
        data: mockData_js_1.VENDORS_DB,
    });
};
exports.getAllVendors = getAllVendors;
const getVendorById = async (req, res) => {
    const { id } = req.params;
    const vendor = mockData_js_1.VENDORS_DB.find((v) => v.id === id);
    if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    const vendorProducts = mockData_js_1.PRODUCTS_DB.filter((p) => p.vendorId === id);
    return res.status(200).json({
        success: true,
        data: {
            ...vendor,
            products: vendorProducts,
        },
    });
};
exports.getVendorById = getVendorById;
