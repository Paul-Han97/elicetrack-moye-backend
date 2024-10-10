export interface IGenerate {
  type: string;
  id: number;
  role: string;
}

export interface IVerify {
  type: string;
  authorization: string | undefined;
}

export interface IDecodeJwt {
  id: number,
  role: string,
  exp: number,
  jti: string,
  iat: number
}