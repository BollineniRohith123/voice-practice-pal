/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ULTRAVOX_API_KEY: process.env.ULTRAVOX_API_KEY,
  }
};

export default nextConfig;
