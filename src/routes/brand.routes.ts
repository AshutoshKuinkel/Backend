import express from "express";
import { registerBrand,getAllBrands,removeBrand,getBrandById,updateBrand } from "../controllers/brand.controller";


const router = express.Router()

router.post(`/register`,registerBrand)
router.get(`/`,getAllBrands)
router.delete('/remove/:id', removeBrand)
router.get('/:id',getBrandById)
router.put(`/update/:id`,updateBrand)


export default router