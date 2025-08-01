import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { onlyUser } from "../types/global.types";
import { addProductToCart, getUserCart, updateCart, removeProductFromCart, clearCart } from "../controllers/cart.controller";

const router = express.Router();

router.use(authenticate);
router.use(onlyUser);

router.post("/addToCart", authenticate(onlyUser), addProductToCart);
router.get("/", authenticate(onlyUser), getUserCart);
router.put("/updateCart/:productId",authenticate(onlyUser), updateCart);
router.delete("/remove/:productId",authenticate(onlyUser), removeProductFromCart);
router.delete("/clearCart",authenticate(onlyUser), clearCart);

export default router;