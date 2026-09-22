import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://board.hrjdev.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Authenticated, per-user app pages add no SEO value and should stay
        // out of the crawl - only the marketing/auth entry points matter.
        disallow: ['/projects/', '/invite/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
