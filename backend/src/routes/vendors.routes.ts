import { Router } from "express";
import { getAllVendors, getVendorById } from "../controllers/vendors.controller.js";

const router = Router();

router.get("/", getAllVendors);
router.get("/:id", getVendorById);

export default router;
