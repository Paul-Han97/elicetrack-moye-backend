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

### 하루 예약 조회

#### `GET /stores/:id/reservations`

- **response**

```json
{
  "body": {
      "open": "10:10",
      "close": "18:00",
    [
      {
        "id": 1,
        "name": "엘리스",
        "count": 2,
        "startTime": "10:00",
        "endTime": "11:59",
        "phone": "01091912929",
        "status": "CANCEL"
      },
      {
        "id": 2,
        "name": "예약자1",
        "count": 2,
        "startTime": "13:00",
        "endTime": "15:59",
        "phone": "01033334444",
        "status": "PENDING"
      },
      {
        "id": 3,
        "name": "예약자2",
        "count": 2,
        "startTime": "16:00",
        "endTime": "17:59",
        "phone": "01033334444",
        "status": "ACCEPT"
      },
      {
        "id": 4,
        "name": "예약자3",
        "count": 4,
        "startTime": "18:00",
        "endTime": "18:59",
        "phone": "01033334444",
        "status": "ACCEPT"
      }
    ]
  }
}
```

### 한 달 예약 조회 - 검색

#### `GET /stores/:id/reservations?skip=0`

- **response**

```json
{
  "body": [
    {
      "reservationId": 4,
      "status": "ACCEPT",
      "name": "예약자1",
      "phone": "01033335555",
      "count": 2,
      "ymd": "2024-10-13|0",
      "startTime": "16:00",
      "endTime": "17:59"
    },
    {
      "reservationId": 5,
      "status": "PENDING",
      "name": "예약자2",
      "phone": "01033337777",
      "count": 2,
      "ymd": "2024-10-13|0",
      "startTime": "16:00",
      "endTime": "17:59"
    },
    {
      "reservationId": 6,
      "status": "CANCEL",
      "name": "예약자3",
      "phone": "01033336666",
      "count": 3,
      "ymd": "2024-10-13|0",
      "startTime": "16:00",
      "endTime": "17:59"
    },
    {
      "reservationId": 7,
      "status": "ACCEPT",
      "name": "예약자4",
      "phone": "01033338888",
      "count": 4,
      "ymd": "2024-10-13|0",
      "startTime": "18:00",
      "endTime": "18:59"
    },
    {
      "reservationId": 1,
      "status": "PENDING",
      "name": "예약자5",
      "phone": "01011112222",
      "count": 3,
      "ymd": "2024-10-28|1",
      "startTime": "10:00",
      "endTime": "11:59"
    }
  ]
}
```

### 한 달 예약 조회 - 번호 검색

#### `GET /stores/:id/reservations?search=0103333`

- **response**

```json
{
  "body": [
    {
      "resrvationId": 4,
      "status": "ACCEPT",
      "name": "예약자",
      "phone": "01033334444",
      "count": 2,
      "ymd": "2024-10-13|0",
      "startTime": "16:00",
      "endTime": "17:59"
    }
  ]
}
```

### 한 달 예약 조회 - 이름 검색

#### `GET /reservations/1/stores?search=리스`

- **response**

```json
{
  "body": [
    {
      "resrvationId": 1,
      "status": "PENDING",
      "name": "엘리스",
      "phone": "01011112222",
      "count": 3,
      "ymd": "2024-10-28|1",
      "startTime": "10:00",
      "endTime": "11:59"
    }
  ]
}
```

### 예약 한 건 수정

#### `PUT /reservations/:id`

- **request**

```json
{
  // "ACCEPT" | "PENDING" | "CANCEL"
  "state": "PENDING"
}
```

- **response**

```json
{
  "body": {
    "id": 2,
    "registeredUser": 1,
    "registeredDate": "2024-10-13T23:21:12.935Z",
    "updatedUser": 1,
    "updatedDate": "2024-10-15T04:12:47.000Z",
    "description": "예약2",
    "count": 4,
    "startTime": "2024-10-28T04:00:00.000Z",
    "endTime": "2024-10-28T05:00:00.000Z",
    "reservationState": {
      "id": 2,
      "type": "PENDING"
    }
  }
}
```

### 가게 등록

#### `POST /stores`

- **request**

```json
{
  "businessRegistrationNumber": "123-10-12345",
  "businessName": "테스트(상호명)",
  "name": "테스트 매장 이름",
  "address": "서울특별시 송파구 석촌동 163-1",
  "contact": "02-000-2222",
  "totalSeats": 6,
  "numberPerTable": 12,
  "openingHour": [
    {
      "type": "평일",
      "openFrom": "09:30",
      "closeTo": "18:30"
    },
    {
      "type": "주말",
      "openFrom": "10:00",
      "closeTo": "13:00"
    }
  ],
  "breakTime": [
    {
      "type": "평일",
      "openFrom": "13:30",
      "closeTo": "14:30"
    },
    {
      "type": "주말",
      "openFrom": "11:00",
      "closeTo": "12:00"
    }
  ]
}
```

- **response**

```json
{
  "body": "가게 등록이 완료 되었습니다."
}
```

### 가게 조회

#### `GET /stores/:id`

- **response**

```json
{
  "body": {
    "openingHour": [
      {
        "type": "평일",
        "openFrom": "10:00:00",
        "closeTo": "13:00:00",
        "startBreakTime": "11:00:00",
        "endBreakTime": "12:00:00"
      },
      {
        "type": "주말",
        "openFrom": "09:30:00",
        "closeTo": "18:30:00",
        "startBreakTime": "13:30:00",
        "endBreakTime": "14:30:00"
      }
    ],
    "closedDay": [
      {
        "ymd": "2024-01-25"
      },
      {
        "ymd": "2024-03-23"
      },
      {
        "ymd": "2024-11-30"
      },
      {
        "ymd": "2024-05-23"
      },
      {
        "ymd": "2024-10-30"
      }
    ],
    "regularHoliday": [1, 4, 7],
    "image": [
      {
        "isPrimary": "TRUE",
        "src": "private/15/image1.jpg"
      },
      {
        "isPrimary": "FALSE",
        "src": "private/15/image2.jpg"
      }
    ],
    "businessRegistrationNumber": "123-10-12345",
    "contact": "02-000-2222",
    "totalSeats": 6,
    "numberPerTable": 12,
    "description": "테스트 매장",
    "email": "ph@elice.com"
  }
}
```

### 가게 수정

#### `PUT /stores/:id`

- **request**

```json
{
  "businessRegistrationNumber": "123-10-12345",
  "businessName": "테스트(상호명)",
  "description": "테스트 매장",
  "name": "테스트 매장 이름",
  "address": "서울특별시 송파구 석촌동 163-1",
  "contact": "02-000-2222",
  "totalSeats": 6,
  "numberPerTable": 12,
  "openingHour": [
    {
      "type": "평일",
      "openFrom": "09:30",
      "closeTo": "18:30"
    },
    {
      "type": "주말",
      "openFrom": "10:00",
      "closeTo": "13:00"
    }
  ],
  "breakTime": [
    {
      "type": "평일",
      "openFrom": "13:30",
      "closeTo": "14:30"
    },
    {
      "type": "주말",
      "openFrom": "11:00",
      "closeTo": "12:00"
    }
  ],
  "closedDay": [
    "2024-01-25",
    "2024-03-23",
    "2024-11-30",
    "2024-05-23",
    "2024-10-30"
  ],
  "dayOfWeekDay": [1, 6, 7]
}
```

- **response**

```json
{
  "body": "가게 수정이 완료 되었습니다."
}
```

### 이미지 등록

#### `POST /uploads/:storeId`

- **request**

```json
{
  // 파일
  "files": {file}
}
```

- **response**

```json
{
  "body": "가게 등록이 완료 되었습니다."
}
```
