/** @type {import('next').NextConfig} */
const domains = [];
try {
    if (process.env.IMAGEKIT_URL_ENDPOINT) {
        const u = new URL(process.env.IMAGEKIT_URL_ENDPOINT);
        domains.push(u.hostname);
    }
} catch {}

// Allow Clerk hosted images (avatars, icons)
// Include common Clerk hosts to avoid runtime errors when rendering user images
['img.clerk.com', 'img.clerkstage.dev', 'img.lclclerk.com', 'images.clerk.dev'].forEach((host) => {
    if (!domains.includes(host)) domains.push(host);
});

const nextConfig = {
    images: {
        unoptimized: false,
        domains,
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    // Skip static generation for authenticated routes
    async headers() {
        return [
            {
                source: '/store/:path*',
                headers: [
                    {
                        key: 'X-Robots-Tag',
                        value: 'noindex',
                    },
                ],
            },
            {
                source: '/admin/:path*',
                headers: [
                    {
                        key: 'X-Robots-Tag',
                        value: 'noindex',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
