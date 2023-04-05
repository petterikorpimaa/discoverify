export async function fetchSpotifyAccessTokenData(clientId: string, clientSecret: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return await response.json();
}

export async function searchSpotifyArtists(searchTerm: string, accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=artist`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  });

  return await response.json();
}

export async function getSpotifyArtistTopTracks(artistId: string, accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=FI`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  });

  return await response.json();
}
