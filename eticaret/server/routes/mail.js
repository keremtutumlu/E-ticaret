import { Router } from "express";
import { sendMail } from "../mail/sendMail.js";
import { sendAcceptCreateMail, sendRejectCreateMail } from "../mail/sellerMail.js";

export const router = Router();

router.post('/sendAcceptMail', sendAcceptCreateMail)
router.post('/sendRejectMail', sendRejectCreateMail)