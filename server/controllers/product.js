import ProductModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary"


export const createProd = async (req, res) => {
    try {
        const { name, description, price, categories, variants, seller } = req.body;
        const images = `https://res.cloudinary.com/dbofmdmkp/image/upload/prods/${seller}/${name}.jpg `


        if (!name || !description || !price || !categories || !variants || !seller || !images.length) {
            return res.status(400).send({ message: 'Lütfen tüm gerekli alanları doldurun.', prod: false });
        }

        let prod = await ProductModel.create({
            name,
            description,
            price,
            categories,
            variants,
            images,
            seller
        });

        if (prod) {
            return res.status(200).send({ message: 'Ürün başarıyla oluşturuldu!', data: prod });
        } else {
            return res.status(400).send({ message: 'Oluşturma hatası!' });
        }

    } catch (error) {
        console.error('Ürün oluşturma hatası:', error);
        return res.status(400).send({ message: 'Ürün oluşturulamadı!', error });
    }
};

export const getProd = async (req, res) => {

    try {
        const products = await ProductModel.find({});
        if (products) {
            return res.status(200).send({ message: 'Ürünler getirildi!', data: products })
        } else {
            return res.status(400).send({ message: 'Ürünler bulunamadı veya yok !' })
        }
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

}

export const getProdByCat = async (req, res) => {
    try {
        const { cat } = req.body;
        
        const products = await ProductModel.find({
            'categories.subCategories.name': cat
        }).lean();
        

        if (products.length > 0) {
            return res.status(200).send({ message: 'Ürünler başarıyla getirildi.', data: products });
        } else {
            return res.status(404).send({ message: 'Ürünler bulunamadı!', data: [] });
        }
    } catch (error) {
        return res.status(500).send({ message: 'Ürünleri bulmada hata!', data: error.message });
    }
};


export const getProdById = async (req, res) => {

    try {
        const { objId } = req.body;
        const prod = await ProductModel.findById(objId);
        if (prod) {
            return res.status(200).send({ message: 'Ürün bulundu', data: prod })
        } else {
            return res.status(400).send({ message: 'Ürün bulunamadı!' })
        }

    } catch (error) {
        return res.status(400).send({ message: error.message })
    }

}

export const getProdsByIds = async (req, res) => {
    try {
        const { objIds } = req.body;

        const products = await ProductModel.find({
            _id: { $in: objIds }
        });

        if (products && products.length > 0) {
            return res.status(200).send({ message: 'Ürünler bulundu', data: products });
        } else {
            return res.status(200).send({ message: 'Ürün kalmadı!', data: [] });
        }

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}


export const getCommentsWithUsernames = async (req, res) => {
    try {
        const { prodId } = req.body;

        const product = await ProductModel.findById(prodId);

        if (!product) {
            return res.status(404).send({ message: 'Ürün bulunamadı!' });
        }

        const commentsWithUsernames = await Promise.all(
            product.comments.map(async (comment, index) => {
                try {
                    const user = await userModel.findById(comment.user);

                    if (!user) {
                        console.log(`Kullanıcı bulunamadı: ${comment.user}`);
                    }

                    return {
                        user: user.username || 'Anonim',
                        comment: comment.comment,
                        rate: comment.rate,
                        date: comment.date,
                        _id: comment._id
                    };
                } catch (error) {
                    return res.status(400).send({ message: 'Hata oluştu!' });
                }
            })
        );

        return res.status(200).send({
            comments: commentsWithUsernames
        });

    } catch (error) {
        return res.status(500).send({ message: 'Yorumlar getirilirken bir hata oluştu.', error: error.message });
    }
};

export const delComment = async (req, res) => {
    try {
        const { prodId, commentId } = req.body;

        if (!prodId || !commentId) {
            return res.status(400).send({ message: 'Ürün veya yorum ID yok!' });
        }

        const prod = await ProductModel.findById(prodId);

        if (!prod) {
            return res.status(404).send({ message: 'Ürün bulunamadı!' });
        }

        const commentIndex = prod.comments.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).send({ message: 'Yorum bulunamadı!' });
        }

        prod.comments.splice(commentIndex, 1);

        const averageRate = prod.comments.length > 0
            ? prod.comments.reduce((sum, review) => sum + review.rate, 0) / prod.comments.length
            : 0;

        prod.ratings.average = averageRate;

        await prod.save();

        return res.status(200).send({ message: 'Yorum başarıyla kaldırıldı!' });

    } catch (error) {
        return res.status(500).send({ message: 'Yorum silmede hata oluştu.', error: error.message });
    }
};

export const delProd = async (req, res) => {
    try {
        const { objId } = req.body;

        const prod = await ProductModel.findOne({ _id: objId });

        if (!prod) {
            return res.status(400).send({ message: 'Ürün kayıtlarda bulunamadı!' });
        }

        const imageUrl = prod.images[0];
        if (imageUrl) {
            const fullPublicId = `prods/${prod.seller}/${prod.name}`;

            await cloudinary.uploader.destroy(fullPublicId);
        }

        await ProductModel.findOneAndDelete({ _id: objId });

        return res.status(200).send({ message: 'Ürün başarıyla kaldırıldı!' });

    } catch (error) {
        return res.status(500).send({ message: 'Ürün silmede hata oluştu.', error: error.message });
    }
}