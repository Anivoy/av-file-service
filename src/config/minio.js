import { Client } from 'minio';
import { minioConfig as config } from './env.js';

export const minioClient = new Client({
  endPoint: config.INTERNAL_ENDPOINT,
  port: config.INTERNAL_PORT,
  useSSL: config.INTERNAL_USE_SSL,
  accessKey: config.ACCESS_KEY,
  secretKey: config.SECRET_KEY,
});

export const externalMinioClient = new Client({
  endPoint: config.EXTERNAL_ENDPOINT,
  port: config.EXTERNAL_PORT,
  useSSL: config.EXTERNAL_USE_SSL,
  accessKey: config.ACCESS_KEY,
  secretKey: config.SECRET_KEY,
});

(async () => {
  try {
    const exists = await minioClient.bucketExists(config.BUCKET);
    if (!exists) {
      await minioClient.makeBucket(config.BUCKET);
      console.log(`Created bucket: ${config.BUCKET}`);
    }
  } catch (err) {
    console.error('MinIO bucket check error:', err.message);
  }
})();
