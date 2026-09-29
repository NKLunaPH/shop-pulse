import { Router } from "express";
import { getCustomerOrders, getOrderById, createCheckoutOrder } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getCustomerOrders);
router.get("/:id", getOrderById);
router.post("/checkout", createCheckoutOrder);

export default router;
