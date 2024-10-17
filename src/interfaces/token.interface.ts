import { JwtPayload } from "jsonwebtoken";

export interface IGenerate {
  type: string;
  id: number;
  role: string;
}

export interface IVerify {
  type: string;
  token: string;
}

export interface IDecodeJwt extends JwtPayload {
  id: number,
  role: string,
  isValid: boolean
}