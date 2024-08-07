import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Paper } from '@material-ui/core';

const AuthHandler = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/check_login', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          setIsLoggedIn(true);
          setError(null);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    const refreshAccessToken = async () => {
      try {
        const response = await fetch('/api/refresh_token', {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Access token refreshed', data);
        } else {
          console.log('Error refreshing access token');
        }
      } catch (error) {
        console.error('Error refreshing access token', error);
      }
    };

    checkLoginStatus();

    const intervalId = setInterval(refreshAccessToken, 3600 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Paper style={{ padding: '20px', textAlign: 'center' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="h6">
          {isLoggedIn ? 'You are logged in!' : error || 'You are not logged in'}
        </Typography>
      )}
    </Paper>
  );
};

export default AuthHandler;
