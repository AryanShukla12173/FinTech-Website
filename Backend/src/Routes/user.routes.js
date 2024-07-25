import {Router} from "express" 
import verifyIfUserisLoggedIn from "../Middlewares/verifyJWT.js";
import {registerUser,loginUser} from "../Controllers/user.controllers.js"
const userRouter= Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
// // Secured Routes
// userRouter.route("/logout").post(verifyIfUserisLoggedIn,logoutUser);
// userRouter.route("/AdminAccess").post(verifyIfUserisLoggedIn,checkIfUserisAuthorizedtoBeAdmin)
// userRouter.route("/uploadExcel").post(verifyIfUserisLoggedIn,upload.single('excelFile'),handleExcelSubmission)
// userRouter.route("/fetch-result").post(verifyIfUserisLoggedIn,assignExamListandReturntoUser)
export default userRouter;
