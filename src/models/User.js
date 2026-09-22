const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,maxlength:100},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},
  passwordHash:{type:String,required:true},
  role:{type:String,enum:["user","admin"],default:"user"},
  disabled:{type:Boolean,default:false},
  emailVerified:{type:Boolean,default:false},
  profilePhoto:{type:String,default:""},
  quota:{type:Number,default:16106127360},
  usedStorage:{type:Number,default:0},
  createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("User",userSchema);
