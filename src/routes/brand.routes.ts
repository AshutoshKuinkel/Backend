import express from "express";
import { registerBrand,getAllBrands,removeBrand,getBrandById } from "../controllers/brand.controller";


const router = express.Router()

router.post(`/register`,registerBrand)
router.get(`/`,getAllBrands)
router.delete('/remove/:id', removeBrand)
router.get('/:id',getBrandById)


export default router