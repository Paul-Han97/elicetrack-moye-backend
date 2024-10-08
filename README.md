# Elice Project

## error middleware

```ts
(req: Request, res: Response, next: NextFunction) => {
  throw new Error(`${statusMessage.BAD_REQUEST}+${serverMessage.E001}`);
};
```