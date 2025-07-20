
import express from "express";
import { deleteUser, getAll,getById, registerUser} from "../controllers/user.controller";

const router = express.Router();

router.get(`/`,getAll)
router.get(`/:id`,getById)
router.delete(`/:id`,deleteUser)
router.post(`/register`,registerUser)

export default router