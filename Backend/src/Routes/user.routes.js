import {Router} from "express" 
import verifyIfUserisLoggedIn from "../Middlewares/verifyJWT.js";
import {registerUser,loginUser,logoutUser, fetchProfile} from "../Controllers/user.controllers.js"
const userRouter= Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
// // Secured Routes
userRouter.route("/logout").post(verifyIfUserisLoggedIn,logoutUser);
userRouter.route("/profile").post(verifyIfUserisLoggedIn,fetchProfile)
export default userRouter;
