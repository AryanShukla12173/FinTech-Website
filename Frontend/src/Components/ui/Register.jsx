import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function Register() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState({});

  const sendData = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/register`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.message);
      if (response.status === 200) {
        setData(response.data);
        toast.success("Registered Successfully", {
          position: 'top-center'
        });
      } else {
        toast.error("Registration Unsuccessful", {
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration Failed", {
        position: 'top-center'
      });
    }
  };

  return (
    <>
    <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
transition: Bounce
/>
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={3}
      alignItems="center"
      textAlign="center"
      maxWidth="sm"
      className="justify-center m-auto my-24 bg-[#e0e0e0]"
      onSubmit={handleSubmit(sendData)}
      padding={1}
      borderRadius={3}
      width={"33vw"}
    >
      <Typography variant="h4" alignSelf="center" className="">
        Sign Up
      </Typography>
      <TextField
        className="sm:w-1/2"
        id="outlined-basic"
        label="Full Name"
        variant="outlined"
        name="name"
        required
        {...register("name")}
      />
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        name="email"
        type="text"
        required
        className="sm:w-1/2"
        {...register("email")}
      />
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        name="password"
        type="password"
        required
        className="sm:w-1/2"
        {...register("password")}
      />
      <Button
        variant="contained"
        id="RegButton"
        type="submit"
        color="inherit"
      >
        Sign Up
      </Button>
      <Box component="div">
        <Typography>
          <Link href="/login">Already have an account? Sign In</Link>
        </Typography>
      </Box>
      
    </Box>
    </>
  );
}