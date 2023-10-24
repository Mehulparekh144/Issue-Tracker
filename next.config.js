/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing-prod.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/*'
      }
    ]
    // domains: ['https://uploadthing-prod.s3.us-west-2.amazonaws.com']
  }
}

module.exports = nextConfig
