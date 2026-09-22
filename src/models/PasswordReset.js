const mongoose=require("mongoose");
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},token:{type:String,index:true},expiresAt:Date,createdAt:{type:Date,default:Date.now}});
module.exports=mongoose.model("PasswordReset",schema);
