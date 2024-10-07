/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://ccr-api:3042/:path*',
            },
        ];
    },
};

export default nextConfig;