//Bu dosya API modülerliği için API rotalarının tanımı amacıyla kullanılıyor.
//Burada kullanıcıların kayıt işlemlerinin yapılacağı işlemlerin rotaları bulunmakta

import { Router } from "express";
import { login, register } from "../controllers/auth.js";

export const router = Router();

router.post('/login', login);
router.post('/register', register);