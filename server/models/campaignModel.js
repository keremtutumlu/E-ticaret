import mongoose from "mongoose";

const campaignSchema = mongoose.Schema(
    {
        code : {type : String, required : true, unique:true},
        seller : {type : String, required : true},
        percent : {type : Number, required : true}
    },
    {collection : 'campaignsData'}
)

const campaignModel = mongoose.model('campaignsData', campaignSchema);
export default campaignModel;