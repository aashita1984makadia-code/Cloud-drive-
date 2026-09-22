const router=require("express").Router(),bcrypt=require("bcryptjs"),jwt=require("jsonwebtoken"),crypto=require("crypto");
const User=require("../models/User"),PasswordReset=require("../models/PasswordReset"),EmailVerification=require("../models/EmailVerification");
const mail=require("../services/mailer");
const sign=u=>jwt.sign({id:u._id,role:u.role},process.env.JWT_SECRET,{expiresIn:"7d"});
router.post("/register",async(req,res,next)=>{try{
 const {name,email,password}=req.body;if(!name||!email||!password||password.length<8)return res.status(400).json({success:false,message:"Name, email and password (8+ chars) are required"});
 if(await User.exists({email:email.toLowerCase()}))return res.status(409).json({success:false,message:"Email already registered"});
 const u=await User.create({name,email,passwordHash:await bcrypt.hash(password,12),quota:Number(process.env.STORAGE_QUOTA)||16106127360});
 const token=crypto.randomBytes(32).toString("hex");await EmailVerification.create({user:u._id,token,expiresAt:Date.now()+86400000});
 await mail.send(u.email,"Verify your CloudDrive email",`Verify using /api/auth/verify-email/${token}`);
 res.cookie("token",sign(u),{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",maxAge:604800000});
 res.status(201).json({success:true,message:"Account created",data:{user:{id:u._id,name:u.name,email:u.email}}});
}catch(e){next(e)}});
router.post("/login",async(req,res,next)=>{try{const {email,password}=req.body;const u=await User.findOne({email:email?.toLowerCase()});if(!u||u.disabled||!(await bcrypt.compare(password||"",u.passwordHash)))return res.status(401).json({success:false,message:"Invalid credentials"});res.cookie("token",sign(u),{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",maxAge:604800000});res.json({success:true,data:{user:{id:u._id,name:u.name,email:u.email,role:u.role}}});}catch(e){next(e)}});
router.post("/logout",(req,res)=>{res.clearCookie("token");res.json({success:true,message:"Logged out"})});
router.post("/forgot-password",async(req,res,next)=>{try{const u=await User.findOne({email:req.body.email?.toLowerCase()});if(u){const token=crypto.randomBytes(32).toString("hex");await PasswordReset.deleteMany({user:u._id});await PasswordReset.create({user:u._id,token,expiresAt:Date.now()+3600000});await mail.send(u.email,"CloudDrive password reset",`Reset token: ${token}`)}res.json({success:true,message:"If the account exists, reset instructions were sent"});}catch(e){next(e)}});
router.post("/reset-password",async(req,res,next)=>{try{const r=await PasswordReset.findOne({token:req.body.token,expiresAt:{$gt:new Date()}});if(!r)return res.status(400).json({success:false,message:"Invalid or expired token"});const u=await User.findById(r.user);u.passwordHash=await bcrypt.hash(req.body.password,12);await u.save();await r.deleteOne();res.json({success:true,message:"Password changed"});}catch(e){next(e)}});
router.get("/verify-email/:token",async(req,res,next)=>{try{const v=await EmailVerification.findOne({token:req.params.token,expiresAt:{$gt:new Date()}});if(!v)return res.status(400).send("Invalid or expired verification link");await User.findByIdAndUpdate(v.user,{emailVerified:true});await v.deleteOne();res.send("Email verified. You can return to CloudDrive.");}catch(e){next(e)}});
module.exports=router;
