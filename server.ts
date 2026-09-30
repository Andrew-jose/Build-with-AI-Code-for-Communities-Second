import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes/apiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount API endpoints
  app.use('/api', apiRouter);

  if (!isProd) {
    // Mount Vite dev middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: 3000,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[CycloneShield AI] Operations Server online at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start server', err);
  process.exit(1);
});
