import jwt from 'jsonwebtoken';
import createReqModel from '../models/createReqModel.js';
import md5 from 'md5';
import sellerModel from '../models/sellerModel.js';
import campaignModel from '../models/campaignModel.js';
import ProductModel from '../models/productModel.js';

export const registerSeller = async (req, res) => {
    try {
        const { compName, compEmail, password, selectedCity, selectedCountry, selectedDistrict } = req.body;

        if (!compName || !compEmail || !password || !selectedCity || !selectedCountry || !selectedDistrict) {
            return res.status(400).send({ message: 'Lütfen tüm alanları doldurun!' })
        }

        let hashedPassword = md5(password);
        let seller = await sellerModel.create({
            compName: compName,
            compEmail: compEmail,
            password: hashedPassword,
            compAddress: [{
                country: selectedCountry,
                city: selectedCity,
                district: selectedDistrict
            }]
        })

        if (seller) {
            const token = jwt.sign(
                {
                    compName: seller.compName,
                    compEmail: seller.compEmail
                },
                'secretkey'
            )
            return res.status(200).send({ message: 'Şirket kaydı başarıyla tamamlandı!', comp: token })
        } else {
            res.status(400).send({ message: 'Şirket kaydı başarısız!', comp: false })
        }

    } catch (error) {
        res.status(400).send({ message: error.message, comp: false })
    }
}

export const createSellerReq = async (req, res) => {
    try {
        const { compEmail, compName } = req.body;

        if (compEmail && compName) {
            const token = jwt.sign(
                {
                    compEmail: compEmail,
                    compName: compName
                },
                'secretkey',
                { noTimestamp: true }
            )

            await createReqModel.create({
                token: token
            })

            return res.status(200).send({ message: 'İstek gönderildi!' });

        } else {
            return res.status(400).send({ message: 'Eksik giriş!' });
        }

    } catch (error) {
        return res.status(400).send({ message: 'İstek oluşturulamadı.' })
    }
}

export const getCreateSellerReq = async (req, res) => {
    try {
        const data = await createReqModel.find({})
        if (data) {
            const decodedData = data.map(item => {
                const decodedToken = jwt.decode(item.token);
                return (
                    item.toObject(),
                    decodedToken
                );
            });
            return res.status(200).send({ message: 'Veriler başarıyla getirildi.', data: decodedData });
        } else {
            return res.status(400).send({ message: 'Veriler getirilemedi!' });
        }
    }
    catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

export const sellerLogin = async (req, res) => {
    try {
        const { compEmail, password } = req.body;

        if (!compEmail || !password) {
            return res.status(400).send({ message: 'Lütfen tüm alanları doldurun.', comp: false })
        }

        const comp = await sellerModel.findOne({
            compEmail: compEmail
        })

        if (!comp) {
            return res.status(400).send({ message: 'Bu emaile sahip satıcı bulunamadı.', comp: false })
        }

        let hashedPassword = md5(password);

        let token

        if (comp.password == hashedPassword) {
            token = jwt.sign(
                {
                    compName: comp.compName,
                    compEmail: comp.compEmail
                },
                'secretkey'
            )
        } else {
            return res.status(400).send({ message: 'Yanlış parola!', comp: false });
        }

        return res.status(200).send({ message: 'Giriş yapılıyor...', comp: token });

    } catch (error) {
        res.status(400).send({ message: error.message, comp: false })
    }
}

export const createCampaign = async (req, res) => {

    try {
        const { code, seller, percent } = req.body;

        if (!code || !seller || !percent) {
            return res.status(400).send({ message: 'Lütfen tüm alanları doldurun' });
        }

        const campaign = await campaignModel.create({
            code: code,
            seller: seller,
            percent: percent
        })

        if (await campaign) {
            return res.status(200).send({ message: 'Kupon oluşturuldu!', data: campaign });
        } else {
            return res.status(400).send({ message: 'Kupon oluşturmada hata!' });
        }
    } catch (error) {
        return res.status(400).send({message:'Kupon oluşturmada hata!'});
    }

}

export const getCampaign = async (req, res) => {

    try {
        const {seller} = req.body

        if(!seller){
            return res.status(400).send({message:'Satıcı bulunamadı!'});
        }

        const campaign = await campaignModel.find({
            seller : seller
        });

        if(campaign){
            return res.status(200).send({message:'Kampanyalar getiriliyor!', data:campaign});
        }else{
            return res.status(200).send({message:'Satıcıya ait kampanya bulunamadı!'});
        }

    } catch (error) {
        return res.status(400).send({message:'Kampanya kodu getirmede hata!'})
    }

}

export const delCampaign = async (req, res) => {

    try {
        const { code } = req.body;
        
        if(!code){
            return res.status(400).send({message:'Kupon kodu bulunamadı!'});
        }

        await campaignModel.deleteOne({code : code})

        return res.status(200).send({message: 'Kupon kodu başarıyla silindi!'});

    } catch (error) {
        return res.status(400).send({message:'Kampanya kodu silmede hata!'})
    }

}

export const getSellerData = async (req , res) => {

    try {

        const { sellerName } = req.body;

        const seller = await sellerModel.findOne({
            compName : sellerName
        })

        if(!seller){
            return res.status(400).send({message:'Satıcı bulunamadı!'});
        }

        return res.status(200).send({message:'Satıcı getiriliyor.', data : seller});

    } catch (error) {
        return(res.status(400).send({message:'Satıcı bilgilerini getirme hatası!'}));
    }

}

export const getSellerProds = async (req, res) => {

    try {
        const { sellerName } = req.body;
        const prods = await ProductModel.find({
            seller : sellerName
        })

        if(!prods){
            return res.status(400).send({message:'Satıcıya ait ürün yok!'});
        }

        return res.status(200).send({message:'Ürünler getiriliyor!' , data:prods})

    } catch (error) {
        return res.status(400).send({message:'Ürün getirmede hata!'})
    }

}