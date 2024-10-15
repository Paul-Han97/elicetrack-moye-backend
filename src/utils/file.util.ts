import path from 'path';
import fs, { mkdirSync, readdir, readdirSync } from 'fs';

export class FileUtil {
  private readonly PRIVATE = 'private';
  private root = process.cwd();

  public readonly JPG = '.jpg';

  constructor() {
    this.mkdir(this.PRIVATE);
    this.root = path.join(this.root, this.PRIVATE);
  }

  mkdir(dir: string) {
    const workingDir = path.join(this.root, dir);
    try {
      readdirSync(workingDir);
    } catch (e) {
      mkdirSync(workingDir);
    }
  }

  getFileCount(dir: string) {
    let count = 0;
    const workingDir = path.join(this.root, dir);
    
    try {
      count = readdirSync(workingDir).length;
    } catch (e) {
      console.log(e);
    }

    return count;
  }

  getFileExtname(file: Express.Multer.File) {
    return path.extname(file.originalname);
  }

  getWorkingDir(dir: string) {
    return path.join(this.root, dir);
  }
}

export const fileUtil = new FileUtil();
