import Profile from './Profile';
import { useSelector,useDispatch } from 'react-redux';
import Notauthenticated from './Notauthenticated';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { CircularProgress,Box } from '@mui/material';
import { logout } from '../../store/authSlice';

function UserProfile() {
    const dispatch= useDispatch();
    const authStatus = useSelector((state) => state.auth.status);
    const [fetchState, setFetchState] = useState(false);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/profile`, { withCredentials: true });
                if (response.status === 200) {
                    setUserData(response.data);
                    setFetchState(true);
                } else {
                    setFetchState(false);
                    dispatch(logout())
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFetchState(false);
            }
        };

        fetchUserData();
    }, []);

    if (!authStatus) {
        return <Notauthenticated />;
    }

    if (!fetchState) {
        return <Box component={"div"} className='bg-black' sx={{width:"5vw"}} margin={"auto"} display={'flex'} alignItems={'center'} justifyContent={'center'} padding={2} my="38vh" ><CircularProgress/></Box>; // You might want to show a loading indicator
    }

    return <Profile userData={userData} />;
}

export default UserProfile;
