import axios from "axios";
import bcrypt from "bcrypt";
import { query } from "express";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_SECRET,
};
let balance = 0;
export default headers;
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    if (!email || !password) {
      return res.status(401).json({ message: "Incomplete Credentials" });
    }
    const fetch_query = `
      query MyQuery @cached {
    users(where: {email: {_eq: "${email}"}}) {
      password,
      id
    }
  }`;
    const existingUser = await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      { query: fetch_query },
      { headers: headers }
    );
    console.log(existingUser.data.data);
    if (!existingUser) {
      return res.status(500).json({ message: "Error in validation" });
    }
    console.log(existingUser.data.data.users[0].password);
    const encryptedPass = existingUser.data.data.users[0].password;
    if (!(await bcrypt.compare(password, encryptedPass))) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials, Check Email and Password" });
    }
    const accessToken = jwt.sign(
      {
        id: existingUser.data.data.users[0].id,
      },
      process.env.SECRET_ACCESS_TOKEN,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    const refreshToken = jwt.sign({}, process.env.SECRET_REFRESH_TOKEN, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
    console.log(accessToken);
    // Update User with Access Token
    const updatedUser = await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      {
        query: `mutation MyMutation {
    update_users_by_pk(pk_columns: {id: "${existingUser.data.data.users[0].id}"}, _set: {accessToken: "${accessToken}"}) {
      id
    },
  }
  `,
      },
      {
        headers: headers,
      }
    );
    console.log(updatedUser.data.data.update_users_by_pk);
    if (!updatedUser.data.data) {
      return res.status(500).json({ messaage: "Internal Server Error" });
    }
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ messaage: "Logged In Successfully " });
  } catch (error) {
    console.log(error);
  }
};
const logoutUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ messaage: "Invalid User Access" });
    }
    const user = await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      {
        query: `mutation MyMutation {
  update_users(where: {id: {_eq: "${req.user.id}"}}, _set: {accessToken: "NULL"}) {
    affected_rows
    
  }
}`,
      },
      {
        headers: headers,
      }
    );
    if (!user.data.data) {
      return res.status(500).json({ message: "Internal Server Errror" });
    }
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log(error);
  }
};
const fetchProfile = async (req, res) => {
  const user = await axios.post(
    process.env.GRAPHQL_ENDPOINT,
    {
      query: `query MyQuery {
  users_by_pk(id: "${req.user.id}") {
    balance
    email
    name
  }
}
`,
    },
    { headers: headers }
  );
  if (!user) {
    return res.status(401).json({ message: "User is not authenticated" });
  }
  return res.status(200).json(user.data.data.users_by_pk);
};
const transactionHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { type, amount, transaction_receiver_id } = req.body;

    if (!type || !amount || !transaction_receiver_id) {
      return res.status(401).json({ message: "Incomplete Data Sent" });
    }
    const variables = {
      transaction_receiver_id: transaction_receiver_id,
      balance,
    };
    // console.log(type)
    // console.log(amount)
    // console.log(transaction_receiver_id)
    const issuerData = await axios.post(
      process.env.GRAPHQL_ENDPOINT,
      {
        query: `query MyQuery {
    users_by_pk(id: "${req.user.id}") {
      balance
    }
  }`,
      },
      {
        headers: headers,
      }
    );
    //  console.log(issuerData.data.data.users_by_pk.balance)
    balance = issuerData.data.data.users_by_pk.balance;
    console.log(balance);
    if (transaction_receiver_id !== req.user.id) {
      if (type === "Deposit") {
        balance -= amount;
        console.log(balance);
        // Update transaction initiator
        variables.transaction_receiver_id = req.user.id;
        variables.balance = balance;
        const updatedUser1 = await axios.post(
          process.env.GRAPHQL_ENDPOINT,
          {
            query: `mutation MyMutation($transaction_receiver_id: uuid!, $balance: Int!) {
  update_users_by_pk(
    pk_columns: { id: $transaction_receiver_id }, 
    _set: { balance: $balance }
  ) {
    id
    name
    balance
  }
}
`,
            variables: variables,
          },
          {
            headers: headers,
          }
        );
        console.log(updatedUser1.data.data);
        if (!updatedUser1) {
          return res.status(500).json({ messaage: "Transaction unsuccessful" });
        }
        //  fetch user2 current balance
        variables.transaction_receiver_id = transaction_receiver_id;
        variables.balance = 0;
        const user2 = await axios.post(
          process.env.GRAPHQL_ENDPOINT,
          {
            query: `query MyQuery {
  users_by_pk(id: "${transaction_receiver_id}") {
    balance
  }
}`,
          },
          {
            headers: headers,
          }
        );
        console.log(user2.data.data.users_by_pk.balance);
        balance = user2.data.data.users_by_pk.balance;
        balance += amount;
        console.log(balance);
        variables.balance = balance;
        // update second User
        const updatedUser2 = await axios.post(
          process.env.GRAPHQL_ENDPOINT,
          {
            query: `mutation MyMutation($transaction_receiver_id: uuid!, $balance: Int!) {
      update_users_by_pk(
        pk_columns: { id: $transaction_receiver_id }, 
        _set: { balance: $balance }
      ) {
        id
        name
        balance
      }
    }
  `,
            variables: variables,
          },
          {
            headers: headers,
          }
        );
        if (!updatedUser2.data.data) {
          return res
            .status(500)
            .json({
              message: "Internal Server Error, Transaction Unsuccessful",
            });
        }
        return res
          .status(200)
          .json({ message: "Transfer of Funds Successful" });
      }
    } else {
      if (type === "Deposit") {
        balance += amount;
      }
      if (type === "Withdrawal") {
        balance -= amount;
      }
      // Update balance for receiver
      variables.balance = balance;
      const updatedData = await axios.post(
        process.env.GRAPHQL_ENDPOINT,
        {
          query: `mutation MyMutation($transaction_receiver_id: uuid!, $balance: Int!) {
    update_users_by_pk(
      pk_columns: { id: $transaction_receiver_id }, 
      _set: { balance: $balance }
    ) {
      id
      name
      balance
    }
  }
`,
          variables: variables,
        },
        {
          headers: headers,
        }
      );
      console.log(updatedData.data.errors);
      console.log(updatedData.data.data);
      if (!updatedData.data.data) {
        return res
          .status(401)
          .json({ message: "Transaction was unsucccessful" });
      }
      return res.status(200).json("message:Transaction Success");
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchUser= async (req,res)=>{
  try {
   const{email,name} = req.body;
   if(!email || !name){
    return res.status(401).json({messaage:"Incomplete Credentials"})
   }
   const searchedUserDetails= await axios.post(process.env.GRAPHQL_ENDPOINT,{
    query:`query MyQuery {
  users(where: {email: {_eq: "${email}"}, _or: {name: {_eq: "${name}"}}}) {
    id
    email
    name
  }
}
`},{
  headers:headers
})
 
 const data=searchedUserDetails.data.data.users[0]
 console.log(data)
 if(!searchedUserDetails.data.data){
  return res.status(200).json({messaage:"User not Found",
  success:false
  })
 }
 return res.status(200).json({message:"User found",
  success:true,
  data:data
 })
} 
  
catch (error) {
    console.log(error)
  }
}
export {
  registerUser,
  loginUser,
  logoutUser,
  fetchProfile,
  transactionHandler,
  fetchUser
};
