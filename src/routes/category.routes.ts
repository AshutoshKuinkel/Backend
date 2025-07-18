import { registerCategory,getCategoryById,getAllCategory,updateCategory,removeCategory } from './../controllers/category.controller';
import express from "express";


const router = express.Router()

router.post(`/register`,registerCategory)
router.get(`/`,getAllCategory)
router.delete('/remove/:id', removeCategory)
router.get('/:id',getCategoryById)
router.put(`/update/:id`,updateCategory)


export default router