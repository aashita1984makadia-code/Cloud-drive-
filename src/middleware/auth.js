const jwt=require("jsonwebtoken"); const User=require("../models/User");
module.exports=async(req,res,next)=>{
  try{
    const token=req.cookies?.token || (req.headers.authorization||"").replace(/^Bearer\s+/,"");
    if(!token) return res.status(401).json({success:false,message:"Authentication required"});
    const p=jwt.verify(token,process.env.JWT_SECRET); const user=await User.findById(p.id);
    if(!user || user.disabled) return res.status(401).json({success:false,message:"Account unavailable"});
    req.user=user; next();
  }catch(e){res.status(401).json({success:false,message:"Invalid or expired session"});}
};
