import mongoose from 'mongoose';
const { Schema } = mongoose

const sellerAddressSchema = new mongoose.Schema(
    {
        country:{type:String, required:true},
        city:{type:String, required:true},
        district:{type:String, required:true}
    }
)

const sellerCommentSchema = new mongoose.Schema(
    {
        commentOwner:{type:String, required:true},
        commentText:{type:String, required:true},
        commentRate:{type:Number, min:1, max:5, reequired:true},
        commentDate:{type:Date}
    }
)

const sellerSchema = new mongoose.Schema(
    {
        compName:{type:String, required:true, unique:true},
        compEmail:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        compAddress:[sellerAddressSchema],
        compComments:[sellerCommentSchema],
        averageRating: {type:Number, default:0}
    },
    { collection: 'sellersData' }
)

const updateAverageRating = async function() {
    const seller = this;
    if(seller.compComments.length === 0){
        seller.averageRating = 0;
    }else {
        const totalRating = seller.compComments.reduce((acc, comment) => acc + comment.commentRate, 0);
        seller.averageRating = totalRating / seller.compComments.length;
    }
};

sellerSchema.pre('save', function (next) {
    updateAverageRating.call(this)
        .then(() => next())
        .catch(err => next(err));
});

sellerSchema.post('save', function () {
    updateAverageRating.call(this)
        .catch(err => console.error(err));
});

sellerSchema.pre('updateOne', { document: true, query: false }, function (next) {
    const update = this.getUpdate();
    if (update.$push && update.$push.compComments) {
        updateAverageRating.call(this._update)
            .then(() => next())
            .catch(err => next(err));
    } else if (update.$set && update.$set.compComments) {
        updateAverageRating.call(this._update)
            .then(() => next())
            .catch(err => next(err));
    } else {
        next();
    }
});

const sellerModel = mongoose.model('sellersData', sellerSchema)

export default sellerModel