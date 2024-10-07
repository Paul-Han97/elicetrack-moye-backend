import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/schedule-app");

const database = mongoose.connection;

database.on("error", (err) => {
  console.log("Database Error!", err);
});

database.once("open", () => {
  console.log("DB Connected");
});
