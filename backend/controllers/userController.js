import userModel from "../models/userModel.js";


export const getUserData=async(req,res)=>{
    try {
        const userId=req.user?.id || req.body.userId;
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        return res.status(200).json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        });
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}