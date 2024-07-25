import {Router} from "express" 
import verifyIfUserisLoggedIn from "../Middlewares/verifyJWT.js";
import {registerUser,loginUser,logoutUser} from "../Controllers/user.controllers.js"
const userRouter= Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
// // Secured Routes
userRouter.route("/logout").post(verifyIfUserisLoggedIn,logoutUser);
// userRouter.route("/profile")
export default userRouter;
