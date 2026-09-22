const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",index:true},fileName:String,mimeType:String,size:Number,folder:{type:mongoose.Schema.Types.ObjectId,ref:"Folder",default:null},
  totalChunks:Number,receivedChunks:{type:[Number],default:[]},tempDir:String,hash:String,status:{type:String,enum:["uploading","complete","failed"],default:"uploading"},
  createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("UploadSession",schema);
