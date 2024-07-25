import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
const app = express();
var whitelist = ["http://localhost:5173"]

app.use(cors({
     origin:process.env.CORS_ORIGIN,
     credentials:true
}));
app.use(express.json({
    limit:"40kb",

}));
app.use(express.urlencoded({
    extended:true,
    limit:'40kb'
}));
app.use(express.static("public"));
app.use(cookieParser());
//routes
import userRouter from "./Routes/user.routes.js";
//routes declaration
app.use("/api/v1/users",userRouter);
export default app;