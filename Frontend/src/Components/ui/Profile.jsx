
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';   
import { Box,Typography } from "@mui/material"; 
import { TextField,Divider } from "@mui/material";
import Logout from "../../Logout";

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

export default function Profile({userData})
{    console.log("Profile Component Prop:",userData)
  const textFieldItems=[
    {
      text:userData.email,
      label:"Email"
    },
    {
      text:userData.balance,
      label:"Current Account Balance"
    }
    
  ]
    return(
      <Box component={'div'} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center" maxWidth="sm" margin="auto" width="30%" padding={1} height="screen">
        <Stack component={"div"} direction="column" spacing={3}  divider={<Divider orientation="horizontal" flexItem className="bg-black" /> } alignItems={"center"} className="bg-[#9e9e9e]" width="100%" padding={4} borderRadius={1} height="50%"> 
        <Avatar {...stringAvatar(userData.name)}   sx={{ width: 60, height: 60 }} />
        <Typography  textAlign={"center"} variant="h4">{userData.name}</Typography>
        </Stack>
        <Stack direction="column" spacing={2.8} width="100%" height="50%" my={0.2} className="bg-[#e0e0e0]" padding={2} borderRadius={1} >
        {
          textFieldItems.map((item,index)=>(<TextField key={index} variant="outlined" InputProps={{
            readOnly: true,
          }}
          defaultValue={item.text}
          label={item.label}
          color="secondary"
        
          />))
        }
        <Logout></Logout>
        </Stack>
      </Box>
    )
}