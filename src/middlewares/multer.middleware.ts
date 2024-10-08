import multer from "multer";
import fs from "fs";
import path from "path";

try {
  fs.readdirSync("uploads");
} catch (e) {
  console.error("uploads 폴더가 없습니다. 폴더를 생성 합니다.");
  fs.mkdirSync("uploads");
}

export const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, cb) {
      console.log("storage", file);
      cb(null, file.originalname);
    },
    destination(req, file, cb) {
      console.log("destination", file);
      cb(null, "uploads");
    },
  }),
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg") {
      return cb(new Error("파일 확장자가 .jpg이어야 합니다."));
    }
    cb(null, true);
  },
});
