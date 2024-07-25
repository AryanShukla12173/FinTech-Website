import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { type } from "os";
const userSchema = new mongoose.Schema({

    fullname:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type: String,
         required:true
    },
    collegeName:{
     type:String,
     required:true,
     unique:true,
    },
    rollno:{
        type:String,
        required:true,
        unique:true,
    },
    dob:{
        type:String,
        required:true
    },
    accessToken:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
userSchema.pre('save', async function(next){
    if(this.isModified("password")){
      this.password= await bcrypt.hash(this.password,10);
        next();
    }
})
userSchema.methods.isPasswordCorrect= async function(password){
return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=  function(){
  return jwt.sign(
        {_id:this._id,
        email:this.email,
        fullname:this.fullname
        },
        process.env.SECRET_ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        });
}
userSchema.methods.generateRefreshToken= function(){
   return jwt.sign({_id: this._id},
        process.env.SECRET_REFRESH_TOKEN,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        })
}
const User= mongoose.model("User",userSchema);
export {User};