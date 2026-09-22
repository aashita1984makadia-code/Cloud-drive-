const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",index:true},action:String,file:{type:mongoose.Schema.Types.ObjectId,ref:"File"},folder:{type:mongoose.Schema.Types.ObjectId,ref:"Folder"},
  ip:String,metadata:mongoose.Schema.Types.Mixed,timestamp:{type:Date,default:Date.now,index:true}
});
module.exports=mongoose.model("ActivityLog",schema);
