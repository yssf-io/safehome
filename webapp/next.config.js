/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['knex'],
    },
    webpack: (config, { isServer }) => {
        config.externals.push({
            'bufferutil': 'commonjs bufferutil',
            'utf-8-validate': 'commonjs utf-8-validate',
        }, 'lokijs', 'encoding', 'pino-pretty')
        return config;
    },
}

module.exports = nextConfig
