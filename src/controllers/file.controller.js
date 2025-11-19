import {
  uploadFile,
  uploadFiles,
  getFileUrl,
  getFilesUrl,
  deleteFiles,
} from '../services/file.service.js';
import { AppError } from '../utils/errorUtility.js';
import {
  getFileSchema,
  getFilesSchema,
  uploadSchema,
  deleteSchema,
} from '../validations/file.validation.js';

export const getFile = async (req, res, next) => {
  try {
    const { path, public: isPublic, signed } = getFileSchema.parse(req).query;
    const url = await getFileUrl(path, isPublic, signed);

    res
      .status(200)
      .json({ message: 'File URL generated', data: { path, url, isPublic } });
  } catch (err) {
    next(err);
  }
};

export const getFiles = async (req, res, next) => {
  try {
    const {
      paths,
      public: isPublic,
      signed,
    } = getFilesSchema.parse({ body: req.body }).body;
    const data = await getFilesUrl(paths, isPublic, signed);

    res.status(200).json({ message: 'File URLs generated', data });
  } catch (err) {
    next(err);
  }
};

export const upload = async (req, res, next) => {
  try {
    const { destination, public: isPublic, signed } = uploadSchema.parse(req).query;
    if (!req.file) throw new AppError('No file provided', 400);

    const data = await uploadFile(req.file, destination, isPublic, signed);
    res.status(201).json({ message: 'File uploaded', data });
  } catch (err) {
    next(err);
  }
};

export const uploadMultiple = async (req, res, next) => {
  try {
    const { destination, public: isPublic, signed } = uploadSchema.parse(req).query;
    if (!req.files?.length) throw new AppError('No files provided', 400);

    const data = await uploadFiles(req.files, destination, isPublic, signed);
    res.status(201).json({ message: 'Files uploaded', data });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { paths, public: isPublic } = deleteSchema.parse({ body: req.body }).body;
    const deleted = await deleteFiles(paths, isPublic);

    res.status(200).json({ message: 'Files deleted', deleted });
  } catch (err) {
    next(err);
  }
};
