/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'ai.sultatech.com',
              port: '',
              pathname: '/icons/**',
              search: '',
            },
             {
                protocol: 'https'
        , hostname: 'lh3.googleusercontent.com'
             }
          ],
    }
};

export default nextConfig;
