import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';
import useHttp from '../hooks/useHttp';

const UserProfileContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  width: 250,
  position: 'absolute',
  bottom: 0,
  left: 0,
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
}));

const LogoutButtonWrapper = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
}));

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const { sendRequest } = useHttp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await sendRequest({
      path: '/user/signout',
      method: 'POST',
    });
    if (response.ok) {
      setUser(null);
      navigate('/signin');
    }
  }
  return (
    <UserProfileContainer>
      <Box display="flex" alignItems="center" gap={1}>
        <SmallAvatar src="/path-to-avatar.png" alt="User Avatar"/>
        <Typography variant="body1">{user?.username}</Typography>
      </Box>
      <LogoutButtonWrapper>
        <IconButton color="inherit" onClick={() => handleLogout()}>
          <Tooltip title="Sign out">
            <LogoutIcon/>
          </Tooltip>
        </IconButton>
      </LogoutButtonWrapper>
    </UserProfileContainer>
  );
};

export default UserProfile;
