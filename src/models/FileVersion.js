const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  file:{type:mongoose.Schema.Types.ObjectId,ref:"File",index:true},version:{type:Number,required:true},name:String,size:Number,mimeType:String,storagePath:String,hash:String,createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("FileVersion",schema);
