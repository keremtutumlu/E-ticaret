import { Router } from "express";
import jwt from 'jsonwebtoken'

export const router = Router()

router.post('/decodeToken',(req,res) => {
    const {token} = req.body;

    try {
        const decodedToken = jwt.decode(token);
        return res.status(200).send({message:'Decode tamamlandı.', data:decodedToken})
    } catch (error) {
        return res.status(400).send({message:'Decode işlemi başarısız!'})
    }
})