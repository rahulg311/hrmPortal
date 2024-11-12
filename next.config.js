/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    fileBaseUrl: '/files', // Replace '/files' with your desired base URL
  },
}


module.exports = nextConfig


