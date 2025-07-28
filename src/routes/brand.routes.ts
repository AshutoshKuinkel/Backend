import { Role } from './../types/enum.types';
import express from "express";
import { registerBrand,getAllBrands,removeBrand,getBrandById,updateBrand } from "../controllers/brand.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmins } from '../types/global.types';
import { uploader } from '../middlewares/uploader.middleware';


const router = express.Router()

const upload = uploader()

router.post(`/register`,authenticate(allAdmins),upload.single('logo'),registerBrand)
router.get(`/`,getAllBrands)
router.delete('/remove/:id',authenticate(allAdmins),removeBrand)
router.get('/:id',getBrandById)
router.put(`/update/:id`,authenticate(allAdmins),upload.single('logo'),updateBrand)

export default router