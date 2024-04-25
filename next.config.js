/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  webpack: (config, options) => {
    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });
    return config;
  },
};

module.exports = nextConfig;
