"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutOrder = exports.getOrderById = exports.getCustomerOrders = void 0;
const mockData_js_1 = require("../data/mockData.js");
const getCustomerOrders = async (req, res) => {
    return res.status(200).json({
        success: true,
        count: mockData_js_1.ORDERS_DB.length,
        data: mockData_js_1.ORDERS_DB,
    });
};
exports.getCustomerOrders = getCustomerOrders;
const getOrderById = async (req, res) => {
    const { id } = req.params;
    const order = mockData_js_1.ORDERS_DB.find((o) => o.id === id || o.trackingNumber === id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, data: order });
};
exports.getOrderById = getOrderById;
const createCheckoutOrder = async (req, res) => {
    try {
        const { items, subtotal, discount, shipping, tax, total, customerName, email, shippingAddress, paymentMethod } = req.body;
        const newOrder = {
            id: `SP-${Math.floor(100000 + Math.random() * 900000)}`,
            userId: "user-123",
            customerName: customerName || "Alex Rivera",
            email: email || "alex.rivera@example.com",
            items: items || [],
            subtotal: subtotal || 0,
            discount: discount || 0,
            shipping: shipping || 0,
            tax: tax || 0,
            total: total || 0,
            status: "Confirmed",
            trackingNumber: `FX-${Math.floor(1000000000 + Math.random() * 9000000000)}US`,
            carrier: "Pulse Express 2-Day (FedEx)",
            shippingAddress: shippingAddress || "742 Evergreen Terrace, San Francisco, CA",
            paymentMethod: paymentMethod || "Credit Card",
            createdAt: new Date().toISOString(),
        };
        mockData_js_1.ORDERS_DB.unshift(newOrder);
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: newOrder,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCheckoutOrder = createCheckoutOrder;
