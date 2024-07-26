import React from "react";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { NavLink, useNavigate } from "react-router-dom";
import { Divider, Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "axios";
import { logout } from "../../store/authSlice.js";

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
  {
    component: NavLink,
    text: "Logout",
    slug: "/logout",
    variant: "h5",
  },
];

const authallowedIndices = [0, 4, 5];
const allowedIndices = [1, 2];

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/logout`, { withCredentials: true });
      if (response.status === 200) {
        dispatch(logout());
        navigate("/login");
        toast.success("Successfully logged out", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Logout failed: ", error);
      toast.error("Logout failed", {
        position: "top-center",
      });
    }
  };

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
        transition={Bounce}
      />
      <Stack
        spacing={3}
        direction="row"
        divider={<Divider orientation="vertical" flexItem className="bg-blue-400" />}
        sx={{ color: "primary.main" }}
        justifyContent="center"
        alignItems="center"
        className="justify-center h-full"
      >
        {authStatus
          ? navitems
              .filter((item, index) => authallowedIndices.includes(index))
              .map((item, index) =>
                item.text === "Logout" ? (
                  <Link
                    key={index}
                    component="button"
                    color="primary"
                    variant={item.variant}
                    onClick={handleLogout}
                    className=""
                  >
                    {item.text}
                  </Link>
                ) : (
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
                )
              )
          : navitems
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
              ))}
      </Stack>
    </Container>
  );
}
