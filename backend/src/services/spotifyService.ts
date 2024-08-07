import axios from 'axios';

export const getSpotifyUserData = async (accessToken: string) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting Spotify user data', error);
    throw new Error('Error getting Spotify user data');
  }
};