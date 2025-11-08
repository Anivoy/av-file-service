import { config } from 'dotenv';
config();

const serverConfig = Object.freeze({
  PORT: parseInt(process.env.PORT || '5087'),
  MODE: process.env.NODE_ENV || 'production',
});

const minioConfig = Object.freeze({
  INTERNAL_ENDPOINT: process.env.MINIO_INTERNAL_ENDPOINT,
  INTERNAL_PORT: parseInt(process.env.MINIO_INTERNAL_PORT, 10),
  INTERNAL_USE_SSL: process.env.MINIO_INTERNAL_USE_SSL === 'true',

  EXTERNAL_ENDPOINT: process.env.MINIO_EXTERNAL_ENDPOINT,
  EXTERNAL_PORT: parseInt(process.env.MINIO_EXTERNAL_PORT, 10),
  EXTERNAL_USE_SSL: process.env.MINIO_EXTERNAL_USE_SSL === 'true',
  
  PUBLIC_BASE_URL: process.env.MINIO_PUBLIC_BASE_URL,
  
  ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  SECRET_KEY: process.env.MINIO_SECRET_KEY,
  BUCKET: process.env.MINIO_BUCKET,
});

export { serverConfig, minioConfig };
