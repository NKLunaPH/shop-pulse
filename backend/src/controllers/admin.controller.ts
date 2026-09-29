import { Request, Response } from "express";
import { PRODUCTS_DB, VENDORS_DB, ORDERS_DB } from "../data/mockData.js";

export const getAdminMetrics = async (req: Request, res: Response) => {
  const totalGMV = ORDERS_DB.reduce((sum, o) => sum + o.total, 0) + 1428950;
  const platformRevenue = totalGMV * 0.15;

  return res.status(200).json({
    success: true,
    data: {
      metrics: {
        gmv: totalGMV,
        revenue: platformRevenue,
        activeVendors: VENDORS_DB.length,
        totalProducts: PRODUCTS_DB.length,
        totalOrders: ORDERS_DB.length + 24590,
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
