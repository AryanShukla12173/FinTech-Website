import mongoose from "mongoose";
import bcrypt from "bcrypt"

const institutionSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    domain_name:{
     type:String,
     required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    accessToken:{
        type:String
    },
    marksrecord:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Result"
    }
},{timestamps:true})
institutionSchema.pre('save', async function(next){
    if(this.isModified("password")){
      this.password= await bcrypt.hash(this.password,10);
        next();
    }
})
institutionSchema.methods.isPasswordCorrect= async function(password){
return await bcrypt.compare(password,this.password);
}
institutionSchema.methods.generateAccessToken=  function(){
  return jwt.sign(
        {_id:this._id,
        email:this.email,
        },
        process.env.SECRET_ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        });
}
institutionSchema.methods.generateRefreshToken= function(){
   return jwt.sign({_id: this._id},
        process.env.SECRET_REFRESH_TOKEN,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        })
}
const Institution= mongoose.model("Institution",institutionSchema);
export {Institution}