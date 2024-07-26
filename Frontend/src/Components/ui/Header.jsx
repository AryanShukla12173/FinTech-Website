import React from "react";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { NavLink } from "react-router-dom";
import { Divider,Box,TextField,Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import { ToastContainer } from "react-toastify";

const navitems = [
  {
    component: NavLink,
    text: "Profile",
    slug: "/profile",
    variant: "h5",
  },
  {
    component: NavLink,
    text: "Sign Up",
    slug: "/register",
    variant: "h5",
  },
  {
    component: NavLink,
    text: "Sign In",
    slug: "/login",
    variant: "h5",
  },
  {
    component: NavLink,
    text: "Upload Results",
    slug: "/admin/upload",
    variant: "h5",
  },
  {
    component: NavLink,
    text: "Net Banking",
    slug: "/transaction",
    variant: "h5",
  },
];
const authallowedIndices = [0, 4];
const allowedIndices = [1, 2];
const sendData=async(data)=>{
const response = await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/user`,data,{withCredentials:true})
 
}
export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  
  return (
    <Container component="nav" maxWidth="xl" className="bg-black h-20 flex">
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
        transition:Bounce
      />
      <Stack
        spacing={3}
        direction="row"
        divider={
          <Divider orientation="vertical" flexItem className="bg-blue-400" />
        }
        sx={{ color: "primary.main" }}
        justifyContent="center"
        alignItems="center"
        className=" justify-center h-full"
      >
        {authStatus
          ? navitems
              .filter((item, index) => authallowedIndices.includes(index))
              .map((item, index) => (
                <Link
                  key={index}
                  component={NavLink}
                  color="primary"
                  variant={item.variant}
                  to={item.slug}
                  className=""
                >
                  {item.text}
                </Link>
              ))
          : null}
       
        {!authStatus
          ? navitems
              .filter((item, index) => allowedIndices.includes(index))
              .map((item, index) => (
                <Link
                  key={index}
                  component={NavLink}
                  color="primary"
                  variant={item.variant}
                  to={item.slug}
                  className=""
                >
                  {item.text}
                </Link>
              ))
          : null}
      </Stack>
     
    </Container>
  );
}
