import { Router } from "express";
import { createCampaign, createSellerReq, delCampaign, getCampaign, getCreateSellerReq, getSellerData, getSellerProds, registerSeller, sellerLogin } from "../controllers/seller.js";

export const router = Router();

router.post('/createReq', createSellerReq)
router.get('/getCreateSellerReq', getCreateSellerReq)
router.post('/registerSeller', registerSeller) 
router.post('/sellerLogin', sellerLogin)
router.post('/createCampaign', createCampaign)
router.post('/getCampaign', getCampaign)
router.post('/delCampaign', delCampaign)
router.post('/getSellerProds', getSellerProds)
router.post('/getSellerData', getSellerData)