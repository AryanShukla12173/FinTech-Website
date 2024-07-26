import { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useDispatch} from 'react-redux';
import { logout } from './store/authSlice';
import ErrorPrint from './Components/utils/ErrorPrint';
import { Navigate } from 'react-router-dom';


export default function Logout() {
  const [loggedOut, setLoggedOut] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const logoutConfirmation = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/logout`,{withCredentials:true});
      console.log(response.data);
      if (response.status === 200) {
        dispatch(logout());
        setLoggedOut(true);
      } else {
        setError('Logout was unsuccessful');
      }
    } catch (error) {
      setError(error.message);
    }

  }
  return (
    <>
      <Button variant="contained" onClick={logoutConfirmation}  className='w-1/2 left-24'  size="medium" color='inherit'>Logout</Button>
      {loggedOut && <Navigate to="/" />}
      {error && <ErrorPrint content={error} />}
    </>
  );
}
