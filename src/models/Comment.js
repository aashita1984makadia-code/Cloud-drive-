const mongoose=require("mongoose");
const commentSchema=new mongoose.Schema({
  file:{type:mongoose.Schema.Types.ObjectId,ref:"File",index:true},user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  parent:{type:mongoose.Schema.Types.ObjectId,ref:"Comment",default:null},text:{type:String,required:true,maxlength:5000},createdAt:{type:Date,default:Date.now},updatedAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("Comment",commentSchema);
