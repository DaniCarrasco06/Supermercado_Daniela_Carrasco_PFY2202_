import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // funciona con cualquier nombre de repositorio (HashRouter)
});
