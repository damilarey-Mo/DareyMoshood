import {
  vitePlugin as remixPlugin,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import rehypePrism from '@mapbox/rehype-prism';

const isStorybook = process.argv.some(arg => arg.includes('storybook'));

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    outDir: 'dist', // ✅ Ensures Vite outputs to 'dist' for Vercel
    assetsInlineLimit: 1024,
    chunkSizeWarningLimit: 2048, // ✅ Prevents build warnings
    publicDir: 'public', // ✅ Ensures public assets are properly served
  },
  server: {
    port: 7777,
    strictPort: true,
    proxy: {}, // ✅ Keep empty for now to avoid conflicts
    hmr: true,
    watch: {
      usePolling: true,
    },
    fallback: {
      rewrites: [{ source: '**', destination: '/index.html' }], // ✅ Ensures React Router works properly
    },
  },
  resolve: {
    alias: {
      '@': '/src', // ✅ Fix alias for imports
    },
  },
  plugins: [
    mdx({
      rehypePlugins: [[rehypeImgSize, { dir: 'public' }], rehypeSlug, rehypePrism],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),
    remixCloudflareDevProxy(),
    remixPlugin({
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/', 'routes/home/route.jsx', { index: true });
          route('/about', 'routes/about/route.jsx');
          route('/contact', 'routes/contact/route.jsx');
        });
      },
    }),
    jsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: ['@remix-run/dev'], // ✅ Prevents Remix dependencies from breaking the build
  },
});
