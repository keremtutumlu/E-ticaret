import mongoose from "mongoose";

const subCatSchema = new mongoose.Schema(
    {
        name:{type:String, required:true},
        subCats : [{type:mongoose.Schema.Types.ObjectId, ref: 'catSchema'}]
    },
    {_id:false}
)

const catSchema = new mongoose.Schema(
    {
        name:{type:String, required: true, unique:true},
        subCats: [subCatSchema]
    },
    {collection: 'catsData'}
)

const categoryModel = mongoose.model('catsData', catSchema);

export default categoryModel