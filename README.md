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
(req: any, res: Response, next: NextFunction) => {
  throw new Error(`${statusMessage.BAD_REQUEST}+${serverMessage.E001}`);
};
```

# API 명세서
## `HOST localhost:5000`
<hr>

### Email로 검색
#### `GET /users?email="ph@elice.com`
- **response**
```json
"body": {
  "id": 1,
  "name": "엘리스",
  "phone": "01012341234"
}
```

### 로그인
#### `POST /login`
- **request**
```json
{
  "username": "ph@elice.com",
  "password": "elice"
}
```

- **response**
```json
"body": {
  "access": "eyJ...rWIzo",
  "refresh": "eyJ...XmNI4"
}
```
<hr>