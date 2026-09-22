const path=require("path"),fs=require("fs");
const root=path.resolve(process.env.STORAGE_ROOT||path.join(process.cwd(),"storage"));
exports.root=root;
exports.userDir=id=>path.join(root,"users",String(id));
exports.filePath=(id,name)=>path.join(exports.userDir(id),name);
exports.publicSafe=(p)=>path.resolve(p).startsWith(root+path.sep);
exports.ensure=()=>fs.mkdirSync(root,{recursive:true});
