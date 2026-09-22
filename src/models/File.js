const mongoose=require("mongoose");
const fileSchema=new mongoose.Schema({
  name:{type:String,required:true,index:true},originalName:String,extension:String,mimeType:String,size:{type:Number,default:0},
  hash:{type:String,index:true},owner:{type:mongoose.Schema.Types.ObjectId,ref:"User",index:true},
  folder:{type:mongoose.Schema.Types.ObjectId,ref:"Folder",default:null,index:true},storagePath:String,thumbnailPath:String,
  starred:{type:Boolean,default:false},trashed:{type:Boolean,default:false,index:true},trashedAt:Date,
  version:{type:Number,default:1},lastAccessed:Date,createdAt:{type:Date,default:Date.now},updatedAt:{type:Date,default:Date.now}
});
fileSchema.index({owner:1,folder:1,trashed:1});
fileSchema.index({owner:1,name:"text"});
module.exports=mongoose.model("File",fileSchema);
