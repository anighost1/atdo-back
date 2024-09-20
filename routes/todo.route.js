import { Router } from "express";
import { create, get, deleteTodo, update, complete } from "../controllers/auth/todo.controller.js";

const router = Router()

router.post('/', create)
router.get('/', get)
router.delete('/', deleteTodo)
router.put('/', update)
router.post('/completed', complete)

export default router