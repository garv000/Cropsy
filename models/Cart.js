import mongoose from "mongoose";
const {Schema,model}=mongoose;

const CartSchema=new Schema({
    oid:{type:String,default:"NA"},
    selleremail:{type:String,required:true},
    pid:{type:String,required:true},
    email:{type:String,required:true},
    quantity:{type:Number},
    done:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})

export default mongoose.models.Cart || model("Cart",CartSchema)
