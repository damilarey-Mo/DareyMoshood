import {
  vitePlugin as remix,
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

const isStorybook = process.argv[1]?.includes('storybook');

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    outDir: 'dist', // ✅ Ensure Vite outputs to 'dist' for Vercel
    assetsInlineLimit: 1024,
    chunkSizeWarningLimit: 2048, // ✅ Adjusted to prevent build warnings
  },
  server: {
    port: 7777,
    historyApiFallback: true, // ✅ Ensures React Router/Remix works on refresh
  },
  resolve: {
    alias: {
      '@': '/src', // ✅ Optional alias for cleaner imports
    },
  },
  plugins: [
    mdx({
      rehypePlugins: [[rehypeImgSize, { dir: 'public' }], rehypeSlug, rehypePrism],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),
    remixCloudflareDevProxy(),
    remix({
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/', 'routes/home/route.js', { index: true });
        });
      },
    }),
    jsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: ['@remix-run/dev'], // ✅ Prevents unnecessary Remix dependencies from breaking build
  },
});
