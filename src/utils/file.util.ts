import path from 'path';
import { mkdirSync, readdirSync, unlinkSync } from 'fs';

export class FileUtil {
  private readonly PRIVATE = 'private';
  private readonly root = process.cwd();

  public readonly JPG = '.jpg';
  public readonly cwd = path.join(this.root, this.PRIVATE);

  constructor() {
    this.mkdir(this.cwd);
  }

  mkdir(dir: string) {
    try {
      readdirSync(dir);
    } catch (e) {
      mkdirSync(dir);
    }
  }

  getFileCount(dir: string) {
    let count = 0;
    
    try {
      count = readdirSync(dir).length;
    } catch (e) {
      console.error(e);
    }

    return count;
  }

  join(src: string, target: string) {
      return path.join(src, target);
  }

  getFileExtname(file: Express.Multer.File) {
    return path.extname(file.originalname);
  }

  remove(filePath: string) {
    unlinkSync(filePath);
  } 
}

export const fileUtil = new FileUtil();
