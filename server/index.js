import {router as authRouter} from './routes/auth.js';
import { router as userRouter } from './routes/user.js';
import { router as addressRouter } from './routes/address.js';
import { router as sellerRouter } from './routes/seller.js';
import { router as mailRouter } from './routes/mail.js';
import { router as tokenRouter } from './routes/token.js';
import { router as catRouter} from './routes/category.js';
import { router as imgRouter } from './routes/image.js';
import { router as prodRouter } from './routes/product.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = 3002;

mongoose.connect(process.env.MONGODB_CONNECTION);

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/address', addressRouter);
app.use('/seller', sellerRouter);
app.use('/mail', mailRouter);
app.use('/token', tokenRouter);
app.use('/cat', catRouter);
app.use('/img', imgRouter);
app.use('/prod', prodRouter);

app.listen(port, () => {
    console.log(`Server ${port} portunda çalışıyor...`);
})