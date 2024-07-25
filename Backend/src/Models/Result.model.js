import mongoose, { mongo } from "mongoose";
import { type } from "os";
const resultSchema= new mongoose.Schema({
total_Subjects_and_Marks_Info:{
    type:Object,
    required:true,
    
},
domain:{
    type:String,
    required:true
},
examination_name:{
    type:String,
    required:true,
    unique:true
},
semester:{
    type:String,
    required:true
},
exam_date:{
    type:Date,
    required:true
}
},{timestamps:true})

const Result= mongoose.model("Result",resultSchema);
export default Result;