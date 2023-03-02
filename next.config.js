/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "tokens.1inch.io",
      "lh3.googleusercontent.com",
      "openseauserdata.com",
      "fanbase-1.s3.amazonaws.com",
      "storage.googleapis.com",
      "ipfs.io"
    ]
  },
  output: "standalone"
}
