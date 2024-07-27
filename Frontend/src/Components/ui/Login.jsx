import React from "react";
import { Link as Mui_link, TextField, Typography, Button, Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../store/authSlice.js";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = {
  success: (message) => {
    toast.success(message, {
      icon: "🎉",
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  },
  error: (message) => {
    toast.error(message, {
      icon: "❌",
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  },
  // ... (include info and warn if needed)
};

export default function Login() {
  const authStatus = useSelector((state) => state.auth.status);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sendData = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/login`, 
        data, 
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        dispatch(login(response.data.data.update_users_by_pk));
        showToast.success("Login successful");
      } else {
        dispatch(logout());
        showToast.error("Login failed");
      }
    } catch (error) {
      showToast.error("User is not registered");
      console.error(error);
      dispatch(logout());
    }
  };

  return (
    <Container maxWidth="sm">
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
        theme="colored"
      />
      <Box
        component="form"
        onSubmit={handleSubmit(sendData)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          textAlign: 'center',
          bgcolor: '#e0e0e0',
          p: 3,
          borderRadius: 2,
          mt: { xs: 4, sm: 8 },
          width: '100%',
          maxWidth: '400px',
          mx: 'auto'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <TextField
          fullWidth
          id="email"
          label="Email Address"
          variant="outlined"
          {...register("email")}
          required
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          {...register("password")}
          required
        />
        <Mui_link
          component={Link}
          to="/register"
          variant="body1"
          underline="hover"
        >
          New Here? Register Now
        </Mui_link>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          fullWidth
        >
          Sign In
        </Button>
      </Box>
      {authStatus && <Navigate to="/" />}
    </Container>
  );
}