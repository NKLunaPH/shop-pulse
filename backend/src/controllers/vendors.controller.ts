import { Request, Response } from "express";
import { VENDORS_DB, PRODUCTS_DB } from "../data/mockData.js";

export const getAllVendors = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    count: VENDORS_DB.length,
    data: VENDORS_DB,
  });
};

export const getVendorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const vendor = VENDORS_DB.find((v) => v.id === id);

  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  const vendorProducts = PRODUCTS_DB.filter((p) => p.vendorId === id);

  return res.status(200).json({
    success: true,
    data: {
      ...vendor,
      products: vendorProducts,
    },
  });
};
