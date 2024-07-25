import  jwt from "jsonwebtoken";
import { User } from "../Models/User.model.js";
const verifyIfUserisLoggedIn= async (req,res,next)=>{
try {
  const token=req.cookies?.accessToken ||req.header("Authorization")?.replace("Bearer ","");
     if(!token){
       return  res.status(400).json({message:"User does not have appropriate credentials"});
     }
     const accessToken=jwt.verify(token,process.env.SECRET_ACCESS_TOKEN);
      if(!accessToken){
      return  res.status(400).json({message:"Invalid Token"});
      }
      const user= await User.findById(accessToken._id).select("-password -refreshToken");
       if(!user){
        return res.status(400).json({message:"Token invalid, user cannot be found"});
       }
        req.user=user;
        next();
} catch (error) {
  return res.json(error);  
}
}
export default verifyIfUserisLoggedIn;