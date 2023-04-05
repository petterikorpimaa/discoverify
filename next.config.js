/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    LASTFM_API_KEY: process.env.LASTFM_API_KEY,
    LASTFM_API_SECRET: process.env.LASTFM_API_SECRET,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  }
}

module.exports = nextConfig
