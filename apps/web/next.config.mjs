/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile the internal package from source (Just-in-Time packages pattern) —
  // no separate build step is needed for `@repo/ui`.
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
