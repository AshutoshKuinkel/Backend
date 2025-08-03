import express from "express";
import { addProductToCart, getUserCart, updateCart, removeProductFromCart, clearCart } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { onlyUser } from "../types/global.types";

const router = express.Router();



router.post("/addToCart",authenticate(onlyUser),  addProductToCart);
router.get("/",authenticate(onlyUser),  getUserCart);
router.put("/updateCart/:productId",authenticate(onlyUser), updateCart);
router.delete("/remove/:productId",authenticate(onlyUser), removeProductFromCart);
router.delete("/clearCart",authenticate(onlyUser), clearCart);

export default router;