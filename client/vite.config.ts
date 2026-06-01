import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';

const normalizeId = (id: string) => id.replace(/\\/g, '/');

const isNodeModule = (id: string) =>
  /(?:^|\/)node_modules\//.test(normalizeId(id));

const hasPackage = (id: string, packageNameOrScope: string) => {
  const normalizedId = normalizeId(id);

  const escapedPackagePath = packageNameOrScope
    .split('/')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('/');

  return new RegExp(
    `(?:^|/)node_modules/(?:\\.pnpm/[^/]+/node_modules/)?${escapedPackagePath}(?:/|$)`
  ).test(normalizedId);
};

const hasAnyPackage = (id: string, packages: string[]) =>
  packages.some((packageName) => hasPackage(id, packageName));

const vendorChunkName = (id: string): string | null => {
  if (!isNodeModule(id)) return null;

  if (hasAnyPackage(id, ['leaflet', 'react-leaflet', '@react-leaflet'])) {
    return 'vendor-map';
  }

  if (
    hasAnyPackage(id, [
      'yet-another-react-lightbox',
      'react-dropzone',
      'file-selector',
    ])
  ) {
    return 'vendor-media';
  }

  if (hasAnyPackage(id, ['react-hook-form', '@hookform', 'zod'])) {
    return 'vendor-forms';
  }

  if (hasAnyPackage(id, ['@tanstack/react-query', '@tanstack/query-core'])) {
    return 'vendor-query';
  }

  if (hasAnyPackage(id, ['react-router', 'react-router-dom'])) {
    return 'vendor-router';
  }

  if (hasPackage(id, 'axios')) {
    return 'vendor-axios';
  }

  if (
    hasAnyPackage(id, [
      '@base-ui',
      'lucide-react',
      'tailwind-merge',
      'class-variance-authority',
    ])
  ) {
    return 'vendor-ui';
  }

  if (hasAnyPackage(id, ['react', 'react-dom', 'scheduler'])) {
    return 'vendor-react';
  }

  return 'vendor';
};

export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react(), tailwindcss()];

  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }) as PluginOption
    );
  }

  return {
    plugins,

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@wanderboard/shared': path.resolve(
          __dirname,
          '../shared/schemas/index.ts'
        ),
      },
    },

    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: vendorChunkName,
              },
            ],
          },
        },
      },
    },
  };
});
