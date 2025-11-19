import express from 'express';
import {
  getFile,
  getFiles,
  remove,
  upload,
  uploadMultiple,
} from '../controllers/file.controller.js';
import { uploadFile, uploadFiles, handleMulterError } from '../middleware/multer.middleware.js';

const router = express.Router();

router.get('/', getFile);

router.post('/', getFiles);

router.post('/upload', uploadFile, handleMulterError, upload);

router.post('/uploads', uploadFiles, handleMulterError, uploadMultiple);

router.delete('/', remove);

export default router;
