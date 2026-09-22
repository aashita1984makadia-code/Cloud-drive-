const ActivityLog=require("../models/ActivityLog");
module.exports=async(req,action,data={})=>ActivityLog.create({user:req.user?._id,action,file:data.file,folder:data.folder,ip:req.ip,metadata:data.metadata});
