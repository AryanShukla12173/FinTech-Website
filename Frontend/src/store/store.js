    import {configureStore} from "@reduxjs/toolkit"
    import { login, logout } from "./authSlice";
    import authReducer from "./authSlice.js";
    const store =configureStore({
        reducer:{
            auth:authReducer
        }
    });
    export default store;