import mongoose from 'mongoose';

const adressSchema = new mongoose.Schema(
    {
        country:{type:String, required:true},
        city:{type:String, required:true},
        district:{type:String, required:true}
    }
)

const cardSchema = new mongoose.Schema(
    {
        cardNo:{type:String, required:true},
        CVV: {type:String, required:true},
        expDate : {type:String, required:true}
    }
)

const userSchema = new mongoose.Schema(
    {
        username:{type:String, required:true, unique:true},
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        isAdmin:{type:Boolean, default:false},
        adresses: [adressSchema],
        cards: [cardSchema],
        favorites: [{type:mongoose.Schema.Types.ObjectId, ref:'productsData'}]
    },
    { collection: 'usersData' }
)

const userModel = mongoose.model('usersData', userSchema)

export default userModel