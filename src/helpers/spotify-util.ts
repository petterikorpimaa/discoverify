import { fetchSpotifyAccessTokenData } from './api-util';

export function getSpotifyAccessToken() {
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  let response = null;

  const spotifyAccessTokenDataFromStorage = sessionStorage.getItem('spotifyAccessToken');
  const spotifyAccessTokenParsed = spotifyAccessTokenDataFromStorage ? JSON.parse(spotifyAccessTokenDataFromStorage) : null;
  const spotifyAccessToken = spotifyAccessTokenParsed?.access_token;
  const spotifyAccessTokenExpired = spotifyAccessTokenParsed?.expires_in < Date.now();

  if (spotifyAccessToken && !spotifyAccessTokenExpired) {
    // Set Spotify access token from session storage
    response = spotifyAccessToken;
  } else if ((!spotifyAccessToken || spotifyAccessTokenExpired) && spotifyClientId && spotifyClientSecret) {
    // Get Spotify access token from API
    fetchSpotifyAccessTokenData(spotifyClientId, spotifyClientSecret).then((data) => {
      const accessTokenData = {
        access_token: data?.access_token,
        expires_in: Date.now() + data?.expires_in,
      };

      if (accessTokenData.access_token && accessTokenData.expires_in) {
        sessionStorage.setItem('spotifyAccessToken', JSON.stringify(accessTokenData));

        response = accessTokenData.access_token;
      }
    });
  }

  return response;
}