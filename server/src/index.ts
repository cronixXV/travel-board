import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { connectDB } from './database';
import authRoutes from './routes/auth';
import placesRoutes from './routes/places';
import photosRoutes from './routes/photos';
import spaRoutes from './routes/spa';
import { UPLOADS_DIR } from './config/paths';
import { getClientDistPath } from './utils/render-html-with-meta';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/places', photosRoutes);
app.use(
  express.static(getClientDistPath(), {
    index: false,
  })
);
app.use(spaRoutes);

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

start();
