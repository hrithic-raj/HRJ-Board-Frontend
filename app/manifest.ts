import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HRJ Board',
    short_name: 'HRJ Board',
    description:
      'HRJ Board is a real-time kanban board for teams to plan, track and collaborate on projects together.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#4f46e5',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
    ],
  };
}
