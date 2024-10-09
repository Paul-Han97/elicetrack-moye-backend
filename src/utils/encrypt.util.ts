import bcrypt from 'bcryptjs';

export class Encrypt {
  static encode(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }

  static matches(p1: string, p2: string) {
    return bcrypt.compareSync(p1, p2);
  }
}
