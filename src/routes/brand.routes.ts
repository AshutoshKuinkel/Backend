import { Role } from './../types/enum.types';
import express from "express";
import { registerBrand,getAllBrands,removeBrand,getBrandById,updateBrand } from "../controllers/brand.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmins } from '../types/global.types';


const router = express.Router()

router.post(`/register`,authenticate(allAdmins),registerBrand)
router.get(`/`,getAllBrands)
router.delete('/remove/:id',authenticate(allAdmins),removeBrand)
router.get('/:id',getBrandById)
router.put(`/update/:id`,authenticate(allAdmins),updateBrand)

export default router