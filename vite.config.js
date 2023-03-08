import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import viteEslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteEslint()],
  resolve: {
    alias: {
      react: path.posix.resolve('packages/react'),
      'react-dom': path.posix.resolve('packages/react-dom'),
      'react-reconciler': path.posix.resolve('packages/react-reconciler'),
      shared: path.posix.resolve('packages/shared'),
      scheduler: path.posix.resolve('packages/scheduler'),
      'react-dom-bindings': path.posix.resolve('packages/react-dom-bindings')
    }
  }
});
