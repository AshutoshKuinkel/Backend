import { authenticate } from '../middlewares/auth.middleware';
import { allAdmins } from '../types/global.types';
import { registerCategory,getCategoryById,getAllCategory,updateCategory,removeCategory } from './../controllers/category.controller';
import express from "express";


const router = express.Router()

router.post(`/register`,authenticate(allAdmins),registerCategory)
router.get(`/`,getAllCategory)
router.delete('/remove/:id',authenticate(allAdmins), removeCategory)
router.get('/:id',getCategoryById)
router.put(`/update/:id`,authenticate(allAdmins),updateCategory)


export default router