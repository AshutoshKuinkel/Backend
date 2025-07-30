import express from "express";
import { registerProductToWishlist, removeProductFromWishlist, getAllWishlistItems, checkIfProductInWishlist } from "../controllers/wishlist.controller";
const router = express.Router();

router.post("/registerProductToWishlist", registerProductToWishlist);
router.delete("/removeProductFromWishlist/:id", removeProductFromWishlist);
router.get("/wishlist", getAllWishlistItems);
router.get("/checkIfProductInWishlist/:productId", checkIfProductInWishlist);

export default router;
