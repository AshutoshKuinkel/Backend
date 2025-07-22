import { registerProduct,getProductById,getAllProduct,updateProduct, removeProduct } from "../controllers/product.controller";
import express from "express";
import { allAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router()

router.post(`/register`,authenticate(allAdmins),registerProduct)
router.get(`/`,getAllProduct)
router.delete('/remove/:id',authenticate(allAdmins), removeProduct)
router.get('/:id',getProductById)
router.put(`/update/:id`,authenticate(allAdmins),updateProduct)


export default router