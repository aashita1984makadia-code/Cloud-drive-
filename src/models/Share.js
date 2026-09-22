const mongoose=require("mongoose");
const shareSchema=new mongoose.Schema({
  token:{type:String,unique:true,index:true},file:{type:mongoose.Schema.Types.ObjectId,ref:"File"},folder:{type:mongoose.Schema.Types.ObjectId,ref:"Folder"},
  owner:{type:mongoose.Schema.Types.ObjectId,ref:"User"},recipientEmail:String,permission:{type:String,enum:["viewer","commenter","editor"],default:"viewer"},
  publicLink:{type:Boolean,default:true},passwordHash:String,expiresAt:Date,allowDownload:{type:Boolean,default:true},createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("Share",shareSchema);
