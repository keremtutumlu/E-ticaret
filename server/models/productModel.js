import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    { _id: false }
);

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        subCategories: [subCategorySchema],
    },
    { _id: false }
);

const variantOptionSchema = new mongoose.Schema(
    {
        option: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
    },
    { _id: false }
);

const variantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        options: [variantOptionSchema],
    },
    { _id: false }
);

const commentsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'usersData', required: true },
    comment: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 5 },
    date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        categories: [categorySchema],
        variants: [variantSchema],
        images: [{ type: String }],
        seller: { type: String, required: true },
        ratings: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },
        comments: [commentsSchema],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        collection: 'productsData',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.virtual('stock').get(function () {
    return this.variants.reduce((totalStock, variant) => {
        return totalStock + variant.options.reduce((variantTotal, option) => {
            return variantTotal + option.stock;
        }, 0);
    }, 0);
});

productSchema.virtual('averageRate').get(function () {
    if (this.comments.length === 0) return 0;

    const totalRate = this.comments.reduce((sum, review) => sum + review.rate, 0);
    return totalRate / this.comments.length;
});

productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const ProductModel = mongoose.model('productsData', productSchema);

export default ProductModel;
