import mongoose from "mongoose";
const {Schema,model}=mongoose;

const UserSchema=new Schema({
    name:{type:String},
    email:{type:String,required:true},
    username:{type:String,required:true},
    address:{type:String},
    contact:{type:String},
    profilepic:{type:String},
    cashfreeid:{type:String},
    cashfreesecret:{type:String},
    password:{type:String},
    type:{type:String},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})

export default mongoose.models.User || model('User',UserSchema) 