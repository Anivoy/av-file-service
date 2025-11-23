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

const publicReadPolicy = (bucket) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Action: ['s3:GetObject'],
      Resource: [`arn:aws:s3:::${bucket}/*`],
    },
  ],
});

async function retry(fn, maxRetries = 30, delay = 5000) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        console.error(`Max retry reached (${maxRetries}).`);
        throw err;
      }
      console.warn(
        `Initialization failed on attempt ${attempt}: ${err.message}. Retrying in ${delay}ms...`,
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export async function initializeMinioBuckets() {
  await retry(async () => {
    try {
      console.log('Initializing MinIO buckets');
      const privateExists = await minioClient.bucketExists(config.PRIVATE_BUCKET);
      if (!privateExists) {
        await minioClient.makeBucket(config.PRIVATE_BUCKET);
        console.log(`Created private bucket: ${config.PRIVATE_BUCKET}`);
      }

      const publicExists = await minioClient.bucketExists(config.PUBLIC_BUCKET);
      if (!publicExists) {
        await minioClient.makeBucket(config.PUBLIC_BUCKET);
        console.log(`Created public bucket: ${config.PUBLIC_BUCKET}`);

        await minioClient.setBucketPolicy(
          config.PUBLIC_BUCKET,
          JSON.stringify(publicReadPolicy(config.PUBLIC_BUCKET)),
        );
        console.log(`Bucket ${config.PUBLIC_BUCKET} is now publicly readable`);
      }

      console.log('MinIO buckets initialized successfully');
    } catch (err) {
      console.error('MinIO bucket setup error:', err.message);
    }
  });
}
