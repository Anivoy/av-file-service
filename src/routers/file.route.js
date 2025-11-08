import express from 'express';
import multer from 'multer';
import * as fileController from '../controllers/file.controller.js';

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

router.get('/', fileController.getFile);

router.post('/list', fileController.getFiles);

router.post('/upload', upload.single('file'), fileController.upload);

router.post('/uploads', upload.array('files', 10), fileController.uploadMultiple);

router.delete('/', fileController.remove);

export default router;