/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    return config
  }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = nextConfig