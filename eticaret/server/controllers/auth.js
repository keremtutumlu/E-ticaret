//Kullanıcı işlemleri için gerekli API işlemleri burada bulunuyor.

import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import md5 from "md5";

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: 'Lütfen tüm alanları doldurun.' });
        }

        const user = await userModel.findOne({
            email: email
        })

        if (!user) {
            return res.status(400).send({ message: 'Bu emaile sahip kullanıcı bulunamadı...' });
        }

        let hashedPassword = md5(password);

        if (user.password == hashedPassword) {
            const token = jwt.sign(
                {
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                'secretkey'
            )

            return res.status(200).send({ message: 'Giriş yapılıyor...', user: token });
        } else {
            return res.status(400).send({ message: 'Hatalı parola!', user: false });
        }

    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: 'Lütfen tüm alanları doldurun.', user: false });
        }

        let hashedPassword = md5(password);
        let user = await userModel.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        if (user) {
            const token = jwt.sign(
                {
                    username: user.username,
                    email: user.email
                },
                'secretkey'
            )
            res.status(201).send({ message: 'Kullanıcı başarıyla oluşturuldu.', user: token });
        } else {
            res.status(400).send({ message: 'Kullanıcı oluşturulamadı.', user: false });
        }
    } catch (error) {
        res.status(400).send({ message: error.message, user: false });
    }
}
