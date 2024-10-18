import { v6 as uuidv6 } from 'uuid';
import { Request } from 'express';
import multer from 'multer';
import { fileUtil } from '../utils/file.util';
import { serverMessage, statusMessage } from '../utils/message.util';
import { STORE_PATH, USER_PATH } from '../constants';

const ENTITY_INDEX = 2;

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extname = fileUtil.getFileExtname(file);

  if (extname.toLowerCase() !== fileUtil.JPG) {
    const msg = `${statusMessage.UNSUPPORTED_MEDIA_TYPE}+${serverMessage.E007}`;
    return cb(new Error(msg));
  }

  const baseUrl = req.baseUrl;
  const entity = baseUrl.split('/')[ENTITY_INDEX];

  if (entity !== USER_PATH && entity !== STORE_PATH) {
    const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E001}`;
    return cb(new Error(msg));
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  filename(req, file, cb) {
    const extname = fileUtil.getFileExtname(file);
    const filename = `${uuidv6()}${extname}`;

    cb(null, filename);
  },
  destination(req, file, cb) {
    const baseUrl = req.baseUrl;
    const entity = baseUrl.split('/')[ENTITY_INDEX];
    const dir = fileUtil.join(fileUtil.cwd, entity);

    fileUtil.mkdir(dir);

    cb(null, dir);
  },
});

const limits = {
  fileSize: 1 * 1024 * 1024 * 10,
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload.array('files', 5);
