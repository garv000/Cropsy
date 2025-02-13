import mongoose from "mongoose";
const {Schema,model}=mongoose;

const PaymentSchema=new Schema({
    name:{type:String},
    to_user:{type:String},
    amount:{type:Number },
    oid:{type:String },
    message:{type:String },
    done:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})
// puri website p background img lagani h na bas? kha gya
export default mongoose.models.Payment || model("Payment",PaymentSchema)