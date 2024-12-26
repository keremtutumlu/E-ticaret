import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/image.js";

export const router = Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadImg',upload.single('image'), uploadImage)