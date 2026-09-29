import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role = "Shopper" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const token = jwt.sign(
      { email, role, id: "user-123" },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, accountType = "shopper" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const token = jwt.sign(
      { email, role: accountType === "merchant" ? "Vendor" : "Shopper", id: `user-${Date.now()}` },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
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
