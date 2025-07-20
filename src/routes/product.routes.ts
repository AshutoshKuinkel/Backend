import { registerProduct,getProductById,getAllProduct,updateProduct, removeProduct } from "../controllers/product.controller";
import express from "express";

const router = express.Router()

router.post(`/register`,registerProduct)
router.get(`/`,getAllProduct)
router.delete('/remove/:id', removeProduct)
router.get('/:id',getProductById)
router.put(`/update/:id`,updateProduct)


export default router