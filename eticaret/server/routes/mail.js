import { Router } from "express";
import { sendAcceptCreateMail, sendRejectCreateMail } from "../mail/sellerMail.js";

export const router = Router();

router.post('/sendAcceptMail', sendAcceptCreateMail)
router.post('/sendRejectMail', sendRejectCreateMail)