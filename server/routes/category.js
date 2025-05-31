import { Router } from "express";
import { addCategory, addSubCategory, deleteSubCategory, getCategories } from "../controllers/category.js";

export const router = Router();

router.post('/addCat', addCategory);
router.post('/addSubCat', addSubCategory);
router.post('/delSubCat', deleteSubCategory);
router.get('/getCat', getCategories);