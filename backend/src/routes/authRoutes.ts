import { Router } from 'express';
import querystring from 'querystring';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email';
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const authUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
    });

  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code' });
  }

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token } = response.data;

    res.cookie('access_token', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ message: 'Tokens stored in cookies' });

  } catch (error) {
    console.error('Error getting tokens', error);
    res.status(500).json({ error: 'Error getting tokens' });
  }
});

router.post('/refresh_token', async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = response.data;

    res.cookie('access_token', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ access_token });

  } catch (error) {
    console.error('Error refreshing access token', error);
    res.status(500).json({ error: 'Error refreshing access token' });
  }
});

// Endpoint to check if the user is logged in
router.get('/check_login', (req, res) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  res.json({ message: 'User is logged in', access_token: accessToken });
});

router.post('/logout', (req, res) => {
  // Logique pour supprimer les tokens ou terminer la session
  // Si vous utilisez des sessions en mémoire, vous pourriez faire :
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session', err);
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });

  // Si vous stockez des tokens dans une base de données, vous pouvez les supprimer ici
  // Par exemple, supprimer un token d'authentification en base de données
});

export default router;
