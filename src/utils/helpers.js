const crypto=require("crypto"),path=require("path"),fs=require("fs");
exports.randomToken=()=>crypto.randomBytes(24).toString("hex");
exports.safeName=n=>path.basename(String(n||"file")).replace(/[^\w.\- ()[\]]/g,"_").slice(0,240);
exports.ext=n=>path.extname(n||"").toLowerCase().slice(0,20);
exports.ensureDir=p=>fs.mkdirSync(p,{recursive:true});
exports.sha256=async file=>new Promise((resolve,reject)=>{const h=crypto.createHash("sha256"),s=fs.createReadStream(file);s.on("data",d=>h.update(d));s.on("error",reject);s.on("end",()=>resolve(h.digest("hex")));});
exports.formatError=(res,err)=>{console.error(err);return res.status(err.status||500).json({success:false,message:err.publicMessage||"Internal server error"});}
