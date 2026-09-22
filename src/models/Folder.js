const mongoose=require("mongoose");
const folderSchema=new mongoose.Schema({
  name:{type:String,required:true,trim:true},owner:{type:mongoose.Schema.Types.ObjectId,ref:"User",index:true},
  parent:{type:mongoose.Schema.Types.ObjectId,ref:"Folder",default:null,index:true},starred:{type:Boolean,default:false},
  trashed:{type:Boolean,default:false},trashedAt:Date,createdAt:{type:Date,default:Date.now},updatedAt:{type:Date,default:Date.now}
});
folderSchema.index({owner:1,parent:1,trashed:1});
module.exports=mongoose.model("Folder",folderSchema);
