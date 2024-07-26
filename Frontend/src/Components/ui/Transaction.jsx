import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Transaction() {
  const { register, handleSubmit } = useForm();
  const [user, setUser] = useState(null);

  const sendData = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/search`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      if (response.status === 200 && response.data.success === true) {
        setUser(response.data.data);
      } else {
        toast.error("User not found. Please check the name and try again.", {
          autoClose: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred while searching for the user", {
        autoClose: 5000,
        position: "top-center",
      });
    }
  };

  const sendData2 = async (data) => {
    if (!user) {
      toast.error("No user selected for the transaction", {
        autoClose: 5000,
        position: "top-center",
      });
      return;
    }
    try {
      const amount = Number(data.balance);
      console.log(amount);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/transaction`, {
        type: "Deposit",
        amount: amount,
        "transaction_receiver_id": user.id
      }, {
        withCredentials: true
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Transaction successful", {
          autoClose: 5000,
          position: "top-center",
        });
      } else {
        toast.error("Transaction failed. Please try again or contact support.", {
          autoClose: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred during the transaction", {
        autoClose: 5000,
        position: "top-center",
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
        transition={Bounce}
      />
      <Box
        component="form"
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="center"
        textAlign="center"
        className="justify-center m-auto bg-[#e0e0e0]"
        onSubmit={handleSubmit(sendData)}
        padding={3}
        borderRadius={3}
        width="50%"
        my={"20px"}
      >
        <TextField
          id="outlined-basic"
          label="Search Users"
          variant="outlined"
          name="name"
          required
          {...register("name")}
        />
        <Button
          variant="contained"
          id="RegButton"
          type="submit"
          color="inherit"
        >
          Search
        </Button>
      </Box>
      {user && (
        <Box component={"div"} className="bg-slate-500" display={"flex"} width={"30vw"} margin={"auto"} my={"5vh"} padding={2} alignItems={"center"} justifyContent={'center'} flexDirection={"column"}>
          <Typography variant="h5">{user.name}</Typography>
          <Box component={"form"} flexDirection={"column"} display={"flex"} gap={3} onSubmit={handleSubmit(sendData2)} className="bg-[#e0e0e0]" height={"50vh"} justifyContent={'center'} alignItems={"center"} width={"100%"} my={2}>
            <Typography variant="h6">Deposit</Typography>
            <TextField variant="outlined" label="Email Address" aria-readonly value={user.email} sx={{ width: "60%" }} />
            <TextField variant="outlined" label="Amount to be Deposited" sx={{ width: "60%" }} {...register("balance")} />
            <Button
              variant="contained"
              id="RegButton"
              type="submit"
              color="inherit"
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Transaction;