import campaignModel from '../models/campaignModel.js';
import ProductModel from '../models/productModel.js';
import sellerModel from '../models/sellerModel.js';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import mongoose from 'mongoose';

/*
    ADRES İLE KART EKLEME SİLME VE ÇEKME İŞLEMLERİ
    FAVORİ EKLEME VE ÇEKME İŞLEMLERİ
*/

export const addAdress = async (req, res) => {
    try {
        const { email, adress } = req.body;

        const user = await userModel.findOne({
            email: email,
            adresses: {
                $elemMatch: {
                    country: adress.country,
                    city: adress.city,
                    district: adress.district
                }
            }
        });

        if (user) {
            return res.status(400).send({ message: 'Bu adres zaten eklenmiş!' });
        } else {
            const user = await userModel.findOne({ email: email });

            if (user) {
                user.adresses.push(adress);
                await user.save();
                return res.status(200).send({ message: 'Adres başarıyla eklendi.' });
            } else {
                return res.status(400).send({ message: 'Kullanıcı kayıtlarda bulunamadı!' });
            }
        }
    } catch (error) {
        return res.status(400).send({ message: 'Adres ekleme başarısız.' });
    }
};

export const addCard = async (req, res) => {
    try {
        const { email, card } = req.body;

        const user = await userModel.findOne({
            email: email,
            cards: {
                $elemMatch: {
                    cardNo: card.cardNo,
                    CVV: card.CVV,
                    expDate: card.expDate
                }
            }
        });

        if (user) {
            return res.status(400).send({ message: 'Bu kart zaten eklenmiş!' });
        } else {
            const user = await userModel.findOne({ email: email });

            if (user) {
                user.cards.push(card);
                await user.save();
                return res.status(200).send({ message: 'Kart başarıyla eklendi.' });
            } else {
                return res.status(400).send({ message: 'Kullanıcı kayıtlarda bulunamadı!' });
            }
        }

    } catch (error) {
        return res.status(400).send({ message: 'Kart eklemesi başarısız!' });
    }
}

export const delAddress = async (req, res) => {
    try {
        const { objId, email } = req.body;
        if (!email) {
            return res.status(400).send({ message: 'Öncelikle kullanıcı girişi yapınız!' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı doğrulama hatası!' });
        }

        user.adresses.pop(objId);

        await user.save();

        return res.status(200).send({ message: 'Adres başarıyla kaldırıldı!' });

    } catch (error) {
        return res.status(400).send({ message: 'Adres silme işleminde hata!' })
    }
}

export const delCard = async (req, res) => {
    try {
        const { objId, email } = req.body;
        if (!email) {
            return res.status(400).send({ message: 'Öncelikle kullanıcı girişi yapınız!' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı doğrulama hatası!' });
        }

        user.cards.pop(objId);

        await user.save();

        return res.status(200).send({ message: 'Kart başarıyla kaldırıldı!' });

    } catch (error) {
        return res.status(400).send({ message: 'Kart silme işleminde hata!' })
    }
}

export const getAdress = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ message: 'Email bulunamadı!' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı kayıtlarda bulunamadı!' })
        }

        if (user.adresses.length === 0) {
            return res.status(400).send({ message: 'Kayıtlı adres bulunamadı!', data: [] })
        }

        return res.status(200).send({ message: 'Adres bulundu!', data: user.adresses })

    } catch (error) {
        return res.status(400).send({ message: 'Adres getirme hatası!' });
    }
}

export const getCards = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ message: 'Email bulunamadı!' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı kayıtlarda bulunamadı!' })
        }

        if (user.cards.length === 0) {
            return res.status(400).send({ message: 'Kayıtlı kart bulunamadı!', data: [] })
        }

        return res.status(200).send({ message: 'Kart bulundu!', data: user.cards })

    } catch (error) {
        return res.status(400).send({ message: 'Kart getirme hatası!' });
    }
}

export const addFavorite = async (req, res) => {
    try {
        const { email, prodId } = req.body
        if (!email) {
            return res.status(400).send({ message: 'Önce kullanıcı girişi yapınız!' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı doğrulama hatası!' });
        }

        user.favorites.push(prodId);

        await user.save();

        return res.status(200).send({ message: 'Ürün başarıyla favorilere eklenmiştir!' });

    } catch (error) {
        return res.status(400).send({ message: 'Bir hata ile karşılaşıldı! Hata mesajı : ', error });
    }
}

export const sellFavorite = async (req, res) => {
    try {
        const { objId, email } = req.body;
        if (!email) {
            return res.status(400).send({ message: 'Öncelikle kullanıcı girişi yapınız!' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı doğrulama hatası!' });
        }

        user.favorites.pop(objId);

        await user.save();

        return res.status(200).send({ message: 'Ürün başarıyla favorilerden kaldırıldı!' });

    } catch (error) {
        return res.status(400).send({ message: 'Silme işleminde hata!' })
    }
}

export const getFavoriteProducts = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email: email }).populate('favorites');
        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı bulunamadı!' })
        }
        return res.status(200).send({ message: 'Favoriler getiriliyor!', data: user.favorites });

    } catch (error) {
        return res.status(400).send({ message: 'Ürünleri getirirken bir hata oluştu!' })
    }
}

export const checkCampaign = async (req, res) => {
    try {
        const { seller, code } = req.body;

        const query = {
            code,
            $or: seller.map(s => ({ seller: s }))
        };

        const campaign = await campaignModel.findOne(query);

        if (campaign) {
            return res.status(200).send({ message: 'Kod onaylandı!', data: campaign });
        } else {
            return res.status(404).send({ message: 'Kampanya bulunamadı' });
        }
    } catch (error) {
        return res.status(400).send({ message: 'Kampanya kontrolünde hata oluştu!' });
    }
};

export const addComment = async (req, res) => {
    try {
        const { email, prodId, comment, rate } = req.body;

        if (!email) {
            return res.status(400).send({ message: 'Öncelikle kullanıcı girişi yapınız!' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı doğrulama hatası!' });
        }

        const product = await ProductModel.findById(prodId);
        if (!product) {
            return res.status(404).send({ message: 'Ürün bulunamadı!' });
        }

        const existingComment = product.comments.find((com) => com.user.toString() === user._id.toString());
        if (existingComment) {
            return res.status(400).send({ message: 'Bu ürüne daha önce yorum yaptınız!' });
        }

        const newComment = {
            user: user._id,
            comment: comment,
            rate: rate,
        };

        product.comments.push(newComment);
        product.ratings.average = product.comments.reduce((sum, com) => sum + com.rate, 0) / product.comments.length;
        product.ratings.count = product.comments.length;

        await product.save();

        return res.status(200).send({ message: 'Yorum başarıyla eklendi!' });

    } catch (error) {
        return res.status(500).send({ message: 'Bir hata ile karşılaşıldı!', error });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { email, prodId } = req.body;

        if (!email || !prodId || !Array.isArray(prodId)) {
            return res.status(400).send({ message: 'Eksik veya hatalı ürün ID bilgileri!' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).send({ message: 'Kullanıcı kayıtlarda bulunamadı!' });
        }

        const validProdIds = prodId.map(id => {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return new mongoose.Types.ObjectId(id);
            } else {
                throw new Error(`Geçersiz ürün ID: ${id}`);
            }
        });

        const order = await orderModel.create({
            userId: user._id,
            prodId: validProdIds.map(id => ({ prodId: id })),
        });

        return res.status(200).send({ message: 'Sipariş başarıyla oluşturuldu!', data: order });

    } catch (error) {
        return res.status(400).send({ message: `Sipariş oluşturmada hata: ${error.message}` });
    }
};


export const getOrders = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({email:email})

        if(!user){
            return res.status(400).send({message:'Kullanıcı bulunamadı!'})
        }

        const orders = await orderModel.find({userId:user._id});

        if(orders){
            return res.status(200).send({message:'Siparişler bulundu', data:orders});
        }else{
            return res.status(400).send({message:'Sipariş bulunamadı!', data:[]});
        }

    } catch (error) {
        return res.status(400).send({message:'Sipariş ID getirmede hata!'})
    }
}