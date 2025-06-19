import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // experimental: {
  //   appDir: true, // This enables the app directory, which is required for build caching
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.externals.push('@opentelemetry/exporter-jaeger');
    }

    // Return the modified config
    return config;
  },
};

export default nextConfig;


