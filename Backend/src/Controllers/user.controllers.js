import axios from "axios";
import bcrypt from "bcrypt";
import { query } from "express";

const options = {
  httpOnly: true,
  secure: true,
};

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_SECRET,
};

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
  const {email,password}= req.body;
  console.log(email)
  if(!email || !password){
    return res.status(401).json({message:"Incomplete Credentials"})
  }
  const fetch_query = `
    query MyQuery @cached {
  users(where: {email: {_eq: "ary.shu.rt22@dypatil.edu"}}) {
    password
  }
}
    `;
  const existingUser=await axios.post(
    process.env.GRAPHQL_ENDPOINT,
    {query:fetch_query},
      {headers:headers}
  )
  console.log(existingUser.data)
  if(!existingUser){
    return res.status(500).json({message:"Error in validation"})
  }
  
  
}
export { registerUser,loginUser};
