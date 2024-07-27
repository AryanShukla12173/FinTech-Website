import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useSelector } from "react-redux";

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
  warn: (message) => {
    toast.warn(message, {
      icon: "⚠️",
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  },
};

function Transaction() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const searchUser = async (data) => {
    if (data.name === userData.name) {
      showToast.warn("Cannot search for yourself. Please search for another user.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/search`,
        data,
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.success) {
        setUser(response.data.data);
      } else {
        showToast.error("User not found. Please check the name and try again.");
      }
    } catch (error) {
      showToast.error("An error occurred while searching for the user");
    }
  };

  const makeTransaction = async (data) => {
    if (!user) {
      showToast.error("No user selected for the transaction");
      return;
    }

    try {
      const amount = Math.max(0, Math.floor(Number(data.balance))); // Ensure amount is a non-negative integer
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_ENDPOINT}/transaction`,
      {
        type: "Deposit",
        amount: amount,
        transaction_receiver_id: user.id
      },
      { withCredentials: true }
    );

      if (response.status === 200) {
        showToast.success("Transaction successful");
        reset();
        setUser(null);
      } else if (response.status === 401) {
        showToast.error("Insufficient funds");
      } else {
        showToast.error("Transaction failed. Please try again or contact support.");
      }
    } catch (error) {
      showToast.error("Transaction failed: " + (error.response?.data?.message || "An error occurred"));
    }
  };

  return (
    <Container maxWidth="md">
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
        onSubmit={handleSubmit(searchUser)}
        sx={{
          display: "flex",
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          alignItems: "center",
          bgcolor: '#e0e0e0',
          p: 3,
          borderRadius: 3,
          my: 2,
          width: '100%'
        }}
      >
        <TextField
          fullWidth
          label="Search Users"
          variant="outlined"
          {...register("name", { required: true })}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ minWidth: isMobile ? '100%' : 'auto' }}
        >
          Search
        </Button>
      </Box>

      {user && (
        <Box 
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3,
            my: 2,
            width: '100%',
            boxShadow: 1
          }}
        >
          <Typography variant="h5" gutterBottom>{user.name}</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(makeTransaction)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              bgcolor: '#e0e0e0',
              p: 3,
              borderRadius: 2,
              mt: 2
            }}
          >
            <Typography variant="h6">Deposit</Typography>
            <TextField
              variant="outlined"
              label="Email Address"
              value={user.email}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Amount to be Deposited"
              type="number"
              {...register("balance", { 
                required: true, 
                min: 0,
                onChange: (e) => {
                  const value = Math.max(0, Math.floor(Number(e.target.value)));;
                  setValue("balance", value);
                }
              })}
              InputProps={{
                inputProps: { 
                  min: 0,
                  step: 1
                }
              }}
              fullWidth
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Transaction;