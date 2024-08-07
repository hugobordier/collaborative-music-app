import { Router } from 'express';
import querystring from 'querystring';
import axios from 'axios';

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

  // Validate that the code is a string
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

    // You can save the tokens in the session or database here
    // For now, let's just send them back to the client
    res.json({ access_token, refresh_token });

  } catch (error) {
    console.error('Error getting tokens', error);
    res.status(500).json({ error: 'Error getting tokens' });
  }
});

export default router;
