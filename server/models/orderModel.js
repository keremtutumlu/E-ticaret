import mongoose from "mongoose";

const prodsSchema = new mongoose.Schema(
    {
        prodId: {type:mongoose.Schema.Types.ObjectId, ref : ('productsData'), required:true}
    }
)

const orderSchema = new mongoose.Schema(
    {
        userId : {type:mongoose.Schema.Types.ObjectId, ref : ('usersData'), required:true},
        prodId : [prodsSchema],
        date : { type: Date, default:Date.now}
    },
    {collection:'ordersData'}
)

const orderModel = mongoose.model('ordersData', orderSchema);

export default orderModel;