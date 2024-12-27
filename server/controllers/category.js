import categoryModel from '../models/categoryModel.js'

export const addCategory = async (req,res) => {
    try {
        const { mainCat } = req.body;

        if(!mainCat){
            return res.status(400).send({message:'Lütfen kategori alanını doldurun!'})
        }

        let cat = await categoryModel.create({
            name:mainCat
        })

        if(cat){
            return res.status(200).send({message:`${cat.name} kategorisi başarıyla eklendi!`});
        }else{
            return res.status(400).send({message:'Kategori ekleme başarısızlıkla sonuçlandı.'})
        }
    } catch (error) {
        return res.status(400).send({message:error});
    }
}

export const getCategories = async (req, res) => {
    try {
        let cats = await categoryModel.find({});

        if(cats){
            return res.status(200).send({message:'Veriler getiriliyor...', data:cats});
        }else{
            return res.status(400).send({message:'Veriler getirilemedi veya kategori alanı boş!'})
        }

    } catch (error) {
        return res.status(400).send({message:error});
    }
}

export const addSubCategory = async (req, res) => {
    try {
        const { selectedMainCat, addSubCat } = req.body

        const newSubCat = { name : addSubCat}

        const updatedCat = await categoryModel.findOneAndUpdate(
            {name : selectedMainCat},
            { $push : { subCats : newSubCat}},
            { new : true, useFindAndModify : false}
        );

        if(updatedCat){
            return res.status(200).send({message:'Alt kategori eklendi...', data:updatedCat})
        }else{
            return res.status(400).send({message: 'Kategori bulunamadı!'})
        }

    } catch (error) {
        return res.status(400).send({message:error});
    }
}

export const deleteSubCategory = async (req, res) => {
    try {
        const { mainCat, subCat } = req.body;

        const updatedCat = await categoryModel.findOneAndUpdate(
            {name : mainCat},
            {$pull : { subCats : { name : subCat }}},
            { new : true }
        )

        if(updatedCat){
            return res.status(200).send({message:'Alt kategori başarıyla silindi!', data : updatedCat});
        }else{
            return res.status(400).send({message:'Kategori bulunamadı!'});
        }

    } catch (error) {
        return res.status(400).send({message:error});
    }
}