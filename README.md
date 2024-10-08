# Elice Project

## 명령어

| 명령어          | 실행 명령                               |
| :-------------- | :-------------------------------------- |
| npm run install | npm install --production                |
| npm run start   | node dist/index.js                      |
| npm run build   | tsc --project tsconfig.json             |
| npm run dev     | nodemon --exec \"ts-node\" src/index.ts |

## error middleware

```ts
(req: Request, res: Response, next: NextFunction) => {
  throw new Error(`${statusMessage.BAD_REQUEST}+${serverMessage.E001}`);
};
```
