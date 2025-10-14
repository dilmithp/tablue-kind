/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove React Compiler for now - it's experimental
    typescript: {
        ignoreBuildErrors: false,
    },
}

module.exports = nextConfig
