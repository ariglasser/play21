import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const SOUNDS = 'newnumber,point,gameover,gamestart,levelchanged,pausestate';

export default defineConfig({
  // Relative asset paths, so the build works from any sub-path (e.g. GitHub Pages /play21/).
  base: './',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon-48.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Play 21',
        short_name: 'Play 21',
        description: 'Slide and combine numbers to make 21.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#0b2a1c',
        theme_color: '#0b2a1c',
        categories: ['games', 'puzzle'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Everything the game needs to play offline, including the sounds it uses.
        globPatterns: ['**/*.{js,css,html,woff2,png}', `media/{${SOUNDS}}.wav`],
        maximumFileSizeToCacheInBytes: 1024 * 1024,
      },
    }),
  ],
});
