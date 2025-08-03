import { authenticate } from './../middlewares/auth.middleware';
import express from "express";
import { registerProductToWishlist, removeProductFromWishlist, getAllWishlistItems, checkIfProductInWishlist, clearWishlist } from "../controllers/wishlist.controller";
import { onlyUser } from '../types/global.types';
const router = express.Router();

router.post("/registerProductToWishlist", authenticate(onlyUser),registerProductToWishlist);
router.delete("/removeProductFromWishlist/:id",authenticate(onlyUser), removeProductFromWishlist);
router.get("/wishlist",authenticate(onlyUser), getAllWishlistItems);
router.get("/checkIfProductInWishlist/:productId",authenticate(onlyUser), checkIfProductInWishlist);
router.delete("/clearWishList",authenticate(onlyUser),clearWishlist)

export default router;
