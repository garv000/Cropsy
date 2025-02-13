import mongoose from "mongoose";
const {Schema,model}=mongoose;

const ProductSchema=new Schema({
    pid:{type:String},
    email:{type:String,required:true},
    name:{type:String,required:true},
    pic:{type:String,required:true},
    price:{type:Number,required:true},
    quantity:{type:Number,required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})

export default mongoose.models.Product || model('Product',ProductSchema) 