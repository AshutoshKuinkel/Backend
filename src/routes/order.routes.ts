import express from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { allAdmins, onlyUser } from "../types/global.types";
import { cancelOrder, createOrder, getAllOrdersAdmin, getAllOrdersUser, updateOrderStatus } from "../controllers/order.controller";

const router = express.Router();



router.post("/createOrder",authenticate(onlyUser),  createOrder);
router.get("/allorders",authenticate(allAdmins),  getAllOrdersAdmin);
router.get("/myorders",authenticate(onlyUser),  getAllOrdersUser);
router.put("/updateOrder/:id",authenticate(allAdmins), updateOrderStatus);
router.delete("/cancelOrder/:id",authenticate(onlyUser), cancelOrder);

export default router;