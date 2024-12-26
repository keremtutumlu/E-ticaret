import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import createReqModel from '../models/createReqModel.js';
import jwt from 'jsonwebtoken'

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const sendAcceptCreateMail = async (req, res) => {
    try {
        const { compEmail, compName } = req.body;

        const token = jwt.sign(
            {
                compEmail: compEmail,
                compName: compName       
            }, 
            'secretkey',
            {noTimestamp:true}
        );
        
        const deleteResult = await createReqModel.deleteOne({ token: token });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).send({ message: 'Kayıt bulunamadı.' });
        }

        let mailOptions = {
            from: {
                name: 'ticaretSitesi',
                address: process.env.EMAIL_USER,
            },
            to: [compEmail],
            subject: "Satıcı Hesabı Oluşturma",
            text: "İstek Onayı",
            html: `
                <b>Satıcı hesabı oluşturma isteğiniz onaylanmıştır.</b>
                <a href='${process.env.BASE_URL}/sellerRegister?info=${token}'>Hesap oluşturma sayfasına gitmek için tıklayın.</a>
            `,
        }
        await transporter.sendMail(mailOptions);


        return res.status(200).send({message:'Email gönderildi!'})
    } catch (error) {
        console.error("Email gönderilemedi:", error);
        return res.status(400).send({message:'Email gönderilemedi!'})
    }
}

export const sendRejectCreateMail = async (req, res) => {
    try {
        const { compEmail, compName } = req.body;

        const token = jwt.sign(
            {
                compEmail: compEmail,
                compName: compName       
            }, 
            'secretkey',
            {noTimestamp:true}
        );

        const deleteResult = await createReqModel.deleteOne({ token: token });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).send({ message: 'Kayıt bulunamadı.' });
        }

        let mailOptions = {
            from: {
                name: 'ticaretSitesi',
                address: process.env.EMAIL_USER,
            },
            to: [compEmail],
            subject: "Satıcı Hesabı Oluşturma",
            text: "İstek Reddi",
            html: `
                <b>Satıcı hesabı oluşturma isteğiniz reddedilmiştir. Tekrar başvurmak için 15 gün bekleyiniz.</b>
            `,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).send({ message: 'Email gönderildi!' });

    } catch (error) {
        return res.status(400).send({ message: 'Email gönderilemedi!' });
    }
};
