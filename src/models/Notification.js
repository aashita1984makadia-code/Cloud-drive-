const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",index:true},type:String,message:String,read:{type:Boolean,default:false},data:mongoose.Schema.Types.Mixed,createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("Notification",schema);
