const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

//conntect to db
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello from the backend" });
});

app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
