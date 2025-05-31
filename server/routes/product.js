import { Router } from "express";
import { createProd, delComment, delProd, getCommentsWithUsernames, getProd, getProdByCat, getProdById, getProdsByIds } from "../controllers/product.js";

export const router = Router();

router.post('/createProd', createProd)
router.get('/getProd', getProd)
router.post('/getProdByCat', getProdByCat)
router.post('/getProdById', getProdById)
router.post('/getProdsByIds', getProdsByIds)
router.post('/getCommentsWithUsernames', getCommentsWithUsernames)
router.post('/delComment', delComment)
router.post('/delProd', delProd)