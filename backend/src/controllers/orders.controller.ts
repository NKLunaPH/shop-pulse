import { Request, Response } from "express";
import { ORDERS_DB, Order } from "../data/mockData.js";

export const getCustomerOrders = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    count: ORDERS_DB.length,
    data: ORDERS_DB,
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = ORDERS_DB.find((o) => o.id === id || o.trackingNumber === id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  return res.status(200).json({ success: true, data: order });
};

export const createCheckoutOrder = async (req: Request, res: Response) => {
  try {
    const { items, subtotal, discount, shipping, tax, total, customerName, email, shippingAddress, paymentMethod } = req.body;

    const newOrder: Order = {
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

    ORDERS_DB.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
