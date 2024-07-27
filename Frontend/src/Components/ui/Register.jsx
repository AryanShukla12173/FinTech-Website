import React from "react";
import { TextField, Button, Typography, Box, Container, Link as MuiLink, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
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

export default function Register() {
  const { register, handleSubmit } = useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sendData = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/register`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        showToast.success("Registered Successfully");
      } else {
        showToast.error("Registration Unsuccessful");
      }
    } catch (error) {
      showToast.error("Registration Failed");
      console.error(error);
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
          gap: 3,
          alignItems: 'center',
          textAlign: 'center',
          bgcolor: '#e0e0e0',
          p: 4,
          borderRadius: 2,
          mt: { xs: 4, sm: 8 },
          width: '100%',
          maxWidth: '400px',
          mx: 'auto'
        }}
      >
        <Typography variant="h4" component="h1">
          Sign Up
        </Typography>
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          required
          {...register("name")}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
          required
          {...register("email")}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          required
          {...register("password")}
        />
        <Button
          variant="contained"
          type="submit"
          color="primary"
          fullWidth
        >
          Sign Up
        </Button>
        <Typography variant="body1">
          <MuiLink component={Link} to="/login" underline="hover">
            Already have an account? Sign In
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}