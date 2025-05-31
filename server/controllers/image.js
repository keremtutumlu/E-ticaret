import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    secure: true
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

export const uploadImage = async (req, res) => {
    try {
        const { folder, fileName } = req.body;
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            folder: folder,
            public_id: fileName,
            format: 'jpg'
        };

        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                return res.status(400).json({ message: 'Cloudinary yükleme hatası!' });
            }
            res.status(200).send({message:'Yükleme başarılı!', public_id: result.public_id});
        });

        uploadStream.end(req.file.buffer);

    } catch (error) {
        console.error('Dosya gönderilirken hata :', error);
        res.status(400).json({ message: 'Server Hatası!' });
    }
}