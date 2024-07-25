import axios from "axios";
import bcrypt from "bcrypt";
import { query } from "express";
import jwt from "jsonwebtoken"

const options = {
  httpOnly: true,
  secure: true,
};

 const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_SECRET,
};
export default headers
const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Incomplete Credentials" });
    }

    const fetch_query = `
      query MyQuery {
        users(where: {email: {_eq: "${email}"}}) {
          id
        }
      }
    `;

    // Check if user already exists
    const { data: existingUserData } = await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      { query: fetch_query },
      { headers }
    );

    if (existingUserData.data.users.length > 0) {
      return res.status(401).json({ message: "User already Exists" });
    }

    // Encrypt password
    const encryptedPass = await bcrypt.hash(password, 10);

    const mutate_query = `
      mutation insert_one {
        insert_users_one(object: {email: "${email}", name: "${name}", password: "${encryptedPass}"}) {
          email
          id
          name
        }
      }
    `;

    const { data: newUserData } = await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      { query: mutate_query },
      { headers }
    );

    if (!newUserData.data.insert_users_one) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json(newUserData.data.insert_users_one);
  } catch (error) {
    console.error("Error Message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const loginUser= async (req,res)=>{
  try {
    const {email,password}= req.body;
    console.log(email)
    if(!email || !password){
      return res.status(401).json({message:"Incomplete Credentials"})
    }
    const fetch_query = `
      query MyQuery @cached {
    users(where: {email: {_eq: "${email}"}}) {
      password,
      id
    }
  }`;
    const existingUser=await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      {query:fetch_query},
        {headers:headers}
    )
    console.log(existingUser.data.data)
    if(!existingUser){
      return res.status(500).json({message:"Error in validation"})
    }
    console.log(existingUser.data.data.users[0].password)
    const encryptedPass= existingUser.data.data.users[0].password;
    if(! await bcrypt.compare(password,encryptedPass)){
      return res.status(401).json({message:"Invalid Credentials, Check Email and Password"})
    }
    const accessToken=  jwt.sign({
      id:existingUser.data.data.users[0].id
    },
    process.env.SECRET_ACCESS_TOKEN,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
  const refreshToken = jwt.sign({
  },
process.env.SECRET_REFRESH_TOKEN,
{
 expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
    console.log(accessToken)
    // Update User with Access Token
    const updatedUser = await axios.post(process.env.GRAPHQL_ENDPOINT,{
      query:`mutation MyMutation {
    update_users_by_pk(pk_columns: {id: "${existingUser.data.data.users[0].id}"}, _set: {accessToken: "${accessToken}"}) {
      id
    },
  }
  `},{
    headers:headers
  })
  console.log(updatedUser.data.data.update_users_by_pk)
  if(!updatedUser.data.data){
    return res.status(500).json({messaage:'Internal Server Error'})
  }
  return res.status(200).cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options).json({messaage:"Logged In Successfully "});
  } catch (error) {
    console.log(error)
  }
}
const logoutUser = async (req,res)=>{
  try {
    if(!req.user){
      return res.status(401).json({messaage:"Invalid User Access"})
      }
    const user = await axios.post(process.env.GRAPHQL_ENDPOINT,{
      query:`mutation MyMutation {
  update_users(where: {id: {_eq: "${req.user.id}"}}, _set: {accessToken: "NULL"}) {
    affected_rows
    
  }
}`},
{
  headers:headers
})
if(!user.data.data){
  return res.status(500).json({message:"Internal Server Errror"})
}
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({message:"Logged Out Successfully"})
  } catch (error) {
    console.log(error)
  }
}

export { registerUser,loginUser,logoutUser};
