/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from './Components/ui/Login.jsx'
import Register from './Components/ui/Register.jsx'
import Header from './Components/ui/Header.jsx'
import UserProfile from './Components/ui/UserProfile.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TransactionWrapper from './Components/ui/TransactionWrapper.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { CircularProgress } from '@mui/material'
import { store,persistor } from './store/store.js'
const router= createBrowserRouter([
  {
    path:"/",
     element:<Header/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  },
   {
    path:"/profile",
    element:<UserProfile/>
   },
   {
    path:"/transaction",
    element:<TransactionWrapper/>
   }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider  store={store}>
      <PersistGate loading={<CircularProgress/>} persistor={persistor}>
    <RouterProvider router={router} />
    </PersistGate>
    </Provider>
    </LocalizationProvider>
  </React.StrictMode>,
)
