/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    // TODO [AELIP-15]: Not sure that it's safe though.
    domains: ["tokens.1inch.io", 'rarify-public.s3.amazonaws.com']
  }
}
