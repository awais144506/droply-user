import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Droply Customer Portal',
    short_name: 'Droply',
    description: 'Place your water and gas orders instantly',
    start_url: '/order/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo2.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}