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

### Email로 검색

#### `GET /users?email="ph@elice.com"`

- **response**

```json
{
  "body": {
    "id": 1,
    "name": "엘리스",
    "phone": "01012341234"
  }
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
{
  "body": {
    "access": "eyJ...rWIzo",
    "refresh": "eyJ...XmNI4"
  }
}
```

### 회원가입

#### `POST /users`

- **request**

```json
{
  "email": "abc@elice.com",
  "name": "testName",
  "phone": "01012341234",
  "password": "root"
}
```

- **response**

```json
{
  "body": "회원가입이 완료 되었습니다."
}
```

### 한 달 예약 조회

#### `GET /reservations/:storeId/stores?month=10`

- **response**

```json
{
  "body": {
    "2024-10-14": {
      "ACCEPT": 0,
      "PENDING": 0,
      "CANCEL": 1
    },
    "2024-10-25": {
      "ACCEPT": 1,
      "PENDING": 0,
      "CANCEL": 0
    },
    "2024-10-28": {
      "ACCEPT": 1,
      "PENDING": 2,
      "CANCEL": 1
    }
  }
}
```

### 하루 예약 조회

#### `GET /reservations/:storeId/stores`

- **response**

```json
{
  "body": [
    {
      "name": "엘리스",
      "count": 2,
      "startTime": "10:00",
      "endTime": "11:59",
      "phone": "01091912929",
      "status": "CANCEL"
    },
    {
      "name": "예약자1",
      "count": 2,
      "startTime": "13:00",
      "endTime": "15:59",
      "phone": "01033334444",
      "status": "PENDING"
    },
    {
      "name": "예약자2",
      "count": 2,
      "startTime": "16:00",
      "endTime": "17:59",
      "phone": "01033334444",
      "status": "ACCEPT"
    },
    {
      "name": "예약자3",
      "count": 4,
      "startTime": "18:00",
      "endTime": "18:59",
      "phone": "01033334444",
      "status": "ACCEPT"
    }
  ]
}
```
