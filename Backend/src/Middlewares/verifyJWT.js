import jwt from "jsonwebtoken";
import axios from "axios";
import headers from "../Controllers/user.controllers.js";
const verifyIfUserisLoggedIn = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(400)
        .json({ message: "User does not have appropriate credentials" });
    }
    const accessToken = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    if (!accessToken) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    // console.log(accessToken.id);
    const user = await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      {
        query: `query MyQuery {
                users(where: {id: {_eq: "${accessToken.id}"}}) {
                                                                email
                                                                id
                                                                name
                                                              }
                               }`,
      },
      {
        headers: headers,
      }
    );
    // console.log(user.data.data);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token invalid, user cannot be found" });
    }
    req.user = user.data.data.users[0];
    // console.log(req.user)
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};
export default verifyIfUserisLoggedIn;
