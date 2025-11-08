import path from 'path';
import { minioClient, externalMinioClient } from '../config/minio.js';
import { minioConfig as config } from '../config/env.js';

import { AppError } from '../utils/errorUtility.js';

const bucket = config.BUCKET;

const sanitizePath = (objectPath) => {
  if (!objectPath || typeof objectPath !== 'string') {
    throw new AppError('Invalid object path', 400);
  }

  let sanitized = objectPath.trim().replace(/^\/+|\/+$/g, '');
  sanitized = sanitized.replace(/\/+/g, '/');

  const parts = sanitized
    .split('/')
    .filter((part) => part && part !== '.' && part !== '..');

  if (!parts.length) throw new AppError('Sanitized object path is empty', 400);

  return parts.join('/');
};

export const uploadFile = async (file, destination = '', signed = false) => {
  if (!file || !file.buffer) {
    throw new AppError('Invalid file object', 400);
  }

  const sanitizedDestination = sanitizePath(destination);
  const objectPath = sanitizedDestination
    ? path.posix.join(sanitizedDestination, file.originalname)
    : file.originalname;

  const metaData = {
    'Content-Type': file.mimetype,
    'Content-Length': file.size,
  };

  const stream = Readable.from(file.buffer);
  await minioClient.putObject(bucket, objectPath, stream, file.size, metaData);

  const url = await getFileUrl(objectPath, signed);

  return {
    originalName: file.originalname,
    path: objectPath,
    url,
  };
};

export const uploadFiles = async (files, destination = '', signed = false) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new AppError('No files provided for upload', 400);
  }

  return Promise.all(files.map((file) => uploadFile(file, destination, signed)));
};

export const getFileUrl = async (objectPath, signed = false) => {
  const sanitizedPath = sanitizePath(objectPath);

  if (!sanitizedPath) {
    throw new Error('Invalid object path');
  }

  if (signed) {
    return await externalMinioClient.presignedGetObject(
      bucket,
      sanitizedPath,
      24 * 60 * 60,
    );
  }

  const encodedPath = sanitizedPath.split('/').map(encodeURIComponent).join('/');
  const baseUrl = config.PUBLIC_BASE_URL.replace(/\/+$/, '');

  return `${baseUrl}/${bucket}/${encodedPath}`;
};

export const getFilesUrl = async (paths, signed = false) => {
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new AppError('No paths provided', 400);
  }

  const promises = paths.map(async (p) => ({
    path: sanitizePath(p),
    url: await getFileUrl(p, signed),
  }));
  return Promise.all(promises);
};

export const deleteFiles = async (paths) => {
  const sanitizedPaths = paths.map(sanitizePath).filter(Boolean);

  if (sanitizedPaths.length === 0) {
    throw new Error('No valid paths provided for deletion');
  }

  const objects = sanitizedPaths.map((p) => ({ name: p }));
  await minioClient.removeObjects(bucket, objects);
  return sanitizedPaths;
};
