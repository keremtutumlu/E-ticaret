//Bu dosya API modülerliği için API rotalarının tanımı amacıyla kullanılıyor.
//Burada kullanıcıların yapacağı işlemlerin rotaları bulunmakta

import { Router } from "express";
import { addAdress, addCard, addComment, addFavorite, checkCampaign, createOrder, delAddress, delCard, getAdress, getCards, getFavoriteProducts, getOrders, sellFavorite } from "../controllers/user.js";

export const router = Router();

router.post('/addAdress', addAdress);
router.post('/addCard', addCard);
router.post('/addFavorite', addFavorite);
router.post('/sellFavorite', sellFavorite);
router.post('/getFavProds', getFavoriteProducts);
router.post('/checkCampaign', checkCampaign);
router.post('/getAdress', getAdress);
router.post('/getCards', getCards);
router.post('/delCard', delCard);
router.post('/delAddress', delAddress);
router.post('/addComment', addComment);
router.post('/createOrder', createOrder);
router.post('/getOrders', getOrders);