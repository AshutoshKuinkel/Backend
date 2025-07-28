import { registerProduct,getProductById,getAllProduct,updateProduct, removeProduct } from "../controllers/product.controller";
import express from "express";
import { allAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router()
const upload = uploader()

router.post(`/register`,authenticate(allAdmins),upload.fields([{name: "coverImage",maxCount:1}, {name: "images", maxCount: 5}]),registerProduct)
router.get(`/`,getAllProduct)
router.delete('/remove/:id',authenticate(allAdmins), removeProduct)
router.get('/:id',getProductById)
router.put(`/update/:id`,authenticate(allAdmins),updateProduct)


export default router