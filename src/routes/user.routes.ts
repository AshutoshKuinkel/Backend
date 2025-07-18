
import express from "express";
import { deleteUser, getAll,getById} from "../controllers/user.controller";

const router = express.Router();

router.get(`/`,getAll)
router.get(`/:id`,getById)
router.delete(`/:id`,deleteUser)

export default router