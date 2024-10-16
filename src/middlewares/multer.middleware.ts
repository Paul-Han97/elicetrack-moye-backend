import { v6 as uuidv6 } from 'uuid';
import { Request } from 'express';
import multer from 'multer';
import { fileUtil } from '../utils/file.util';
import { serverMessage, statusMessage } from '../utils/message.util';

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extname = fileUtil.getFileExtname(file);

  if (extname.toLowerCase() !== fileUtil.JPG) {
    const msg = `${statusMessage.BAD_REQUEST}+${serverMessage.E007}`;
    return cb(new Error(msg));
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  filename(req, file, cb) {
    const extname = fileUtil.getFileExtname(file);

    const filename = `${uuidv6()}${extname}`;

    file.originalname = filename;

    cb(null, file.originalname);
  },
  destination(req, file, cb) {
    const { storeId } = req.params;

    fileUtil.mkdir(storeId);

    cb(null, fileUtil.getWorkingDir(storeId));
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
