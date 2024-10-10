export interface IGenerate {
  type: string;
  id: number;
  role: string;
}

export interface IVerify {
  type: string;
  authorization: string | undefined;
}
