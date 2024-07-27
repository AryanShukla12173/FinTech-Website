import React from 'react';
import { Avatar, Stack, Box, Typography, TextField, Divider, useMediaQuery, useTheme } from "@mui/material";
import Logout from "../../Logout";

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] || ''}`,
  };
}

export default function Profile({ userData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const textFieldItems = [
    { text: userData.email, label: "Email" },
    { text: userData.balance, label: "Current Account Balance" }
  ];

  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "sm",
        margin: "auto",
        width: isMobile ? "90%" : "30%",
        padding: 2,
        height: "auto",
      }}
    >
      <Stack 
        direction="column" 
        spacing={3}  
        divider={<Divider orientation="horizontal" flexItem sx={{ bgcolor: 'black' }} />} 
        alignItems="center" 
        sx={{
          bgcolor: '#9e9e9e',
          width: '100%',
          padding: 4,
          borderRadius: 1,
        }}
      >
        <Avatar {...stringAvatar(userData.name)} sx={{ width: 80, height: 80 }} />
        <Typography variant="h4" align="center">{userData.name}</Typography>
      </Stack>
      <Stack 
        direction="column" 
        spacing={2.8} 
        sx={{
          width: '100%',
          mt: 2,
          bgcolor: '#e0e0e0',
          padding: 2,
          borderRadius: 1,
        }}
      >
        {textFieldItems.map((item, index) => (
          <TextField
            key={index}
            variant="outlined"
            InputProps={{ readOnly: true }}
            value={item.text}
            label={item.label}
            color="secondary"
            fullWidth
          />
        ))}
        <Logout />
      </Stack>
    </Box>
  );
}