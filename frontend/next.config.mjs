/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        optimizePackageImports: ["@untitledui/icons", "date-fns", "date-fns/locale/ru"],
    },
};

export default nextConfig;
