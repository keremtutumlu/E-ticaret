import mongoose from "mongoose";

const createReqSchema = new mongoose.Schema(
    {
        token : {type:String, required:true},
        createdAt : {type:Date, default:Date.now}
    }
)

const createReqModel = mongoose.model('createReq', createReqSchema)

export default createReqModel

